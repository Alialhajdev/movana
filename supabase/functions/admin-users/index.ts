// Admin user management: list, delete, reset password
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "missing_auth" }, 401);

    // Verify the caller is an admin via their JWT
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "unauthorized" }, 401);

    const { data: roles } = await userClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id);
    const isAdmin = !!roles?.some((r: any) => r.role === "admin");
    if (!isAdmin) return json({ error: "forbidden" }, 403);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "list") {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 400);
      const ids = data.users.map((u) => u.id);
      const { data: rolesRows } = await admin
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const roleMap = new Map<string, string[]>();
      (rolesRows ?? []).forEach((r: any) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });
      const users = data.users.map((u) => ({
        id: u.id,
        email: u.email,
        name: (u.user_metadata as any)?.name ?? null,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        email_confirmed_at: u.email_confirmed_at,
        roles: roleMap.get(u.id) ?? [],
      }));
      return json({ users });
    }

    if (action === "delete") {
      const id = body.id as string;
      if (!id) return json({ error: "missing_id" }, 400);
      if (id === userData.user.id) return json({ error: "cannot_delete_self" }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reset_password") {
      const email = body.email as string;
      if (!email) return json({ error: "missing_email" }, 400);
      const redirectTo = (body.redirectTo as string) ?? undefined;
      const { data, error } = await admin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: redirectTo ? { redirectTo } : undefined,
      });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true, action_link: data?.properties?.action_link ?? null });
    }

    if (action === "set_password") {
      const id = body.id as string;
      const password = body.password as string;
      if (!id || !password || password.length < 6) return json({ error: "invalid" }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
