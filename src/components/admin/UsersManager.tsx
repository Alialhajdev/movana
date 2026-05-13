import { useEffect, useState } from "react";
import { KeyRound, Trash2, RefreshCw, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useStore, type AdminUser } from "@/lib/store";

export function UsersManager() {
  const { lang } = useI18n();
  const { listAdminUsers, deleteAdminUser, resetAdminUserPassword, user } = useStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try { setUsers(await listAdminUsers()); }
    finally { setLoading(false); }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  const onReset = async (u: AdminUser) => {
    if (!u.email) return;
    setBusyId(u.id);
    const { error, link } = await resetAdminUserPassword(u.email);
    setBusyId(null);
    if (error) { toast.error(error); return; }
    if (link) {
      try { await navigator.clipboard.writeText(link); } catch { /* noop */ }
      toast.success(lang === "ar" ? "تم إنشاء رابط استعادة كلمة المرور (تم نسخه)" : "Password reset link generated (copied)");
    } else {
      toast.success(lang === "ar" ? "تم إرسال رابط الاستعادة" : "Reset link sent");
    }
  };

  const onDelete = async (u: AdminUser) => {
    if (u.id === user?.id) { toast.error(lang === "ar" ? "لا يمكنك حذف حسابك." : "You can't delete yourself."); return; }
    if (!confirm(lang === "ar" ? `حذف المستخدم ${u.email}؟` : `Delete user ${u.email}?`)) return;
    setBusyId(u.id);
    const { error } = await deleteAdminUser(u.id);
    setBusyId(null);
    if (error) { toast.error(error); return; }
    toast.success(lang === "ar" ? "تم حذف المستخدم" : "User deleted");
    setUsers((arr) => arr.filter((x) => x.id !== u.id));
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{lang === "ar" ? "إدارة المستخدمين" : "Users Management"}</h3>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-secondary hover:bg-white/10 px-3 py-2 text-sm disabled:opacity-50">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> {lang === "ar" ? "تحديث" : "Refresh"}
        </button>
      </div>

      {loading && users.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "جاري التحميل…" : "Loading…"}</p>
      ) : users.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا يوجد مستخدمون." : "No users."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3">{lang === "ar" ? "البريد" : "Email"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الاسم" : "Name"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الدور" : "Role"}</th>
                <th className="text-start p-3">{lang === "ar" ? "تاريخ التسجيل" : "Registered"}</th>
                <th className="text-start p-3">{lang === "ar" ? "آخر دخول" : "Last sign-in"}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isSelf = u.id === user?.id;
                return (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3">{u.email ?? "—"}</td>
                    <td className="p-3">{u.name ?? "—"}</td>
                    <td className="p-3">
                      {isAdmin
                        ? <span className="inline-flex items-center gap-1 text-amber-400 text-xs"><ShieldCheck className="size-3" /> Admin</span>
                        : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><Shield className="size-3" /> User</span>}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-xs text-muted-foreground">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}</td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end">
                        <button disabled={busyId === u.id || !u.email} onClick={() => onReset(u)} className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 text-amber-400 hover:bg-amber-500/30 px-3 py-1.5 text-xs disabled:opacity-50">
                          <KeyRound className="size-3" /> {lang === "ar" ? "استعادة كلمة المرور" : "Reset password"}
                        </button>
                        <button disabled={busyId === u.id || isSelf} onClick={() => onDelete(u)} className="inline-flex items-center gap-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30 px-3 py-1.5 text-xs disabled:opacity-50">
                          <Trash2 className="size-3" /> {lang === "ar" ? "حذف" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3">
        {lang === "ar"
          ? "ملاحظة: عند الضغط على \"استعادة كلمة المرور\" يتم إنشاء رابط استعادة وإرساله للمستخدم، وكذلك نسخه إلى الحافظة لمشاركته يدوياً عند الحاجة."
          : "Note: \"Reset password\" generates a recovery link, emails it to the user, and copies it to your clipboard for manual sharing if needed."}
      </p>
    </div>
  );
}
