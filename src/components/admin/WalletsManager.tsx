import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { useStore, type Wallet } from "@/lib/store";

type Draft = Omit<Wallet, "id" | "order">;
const empty: Draft = { name: "", number: "", icon: "💳", active: true };

export function WalletsManager() {
  const { lang } = useI18n();
  const { wallets, addWallet, updateWallet, deleteWallet } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(empty);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadIcon = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `wallets/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("series-images").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("series-images").getPublicUrl(path);
      setDraft((d) => ({ ...d, icon: data.publicUrl }));
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (w: Wallet) => {
    setEditingId(w.id);
    setDraft({ name: w.name, number: w.number, icon: w.icon ?? "", active: w.active });
    setCreating(false);
  };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(empty); };

  const save = async () => {
    if (!draft.name.trim() || !draft.number.trim()) { toast.error(lang === "ar" ? "الاسم والرقم مطلوبان" : "Name and number required"); return; }
    if (creating) { await addWallet(draft); toast.success(lang === "ar" ? "تمت الإضافة" : "Added"); }
    else if (editingId) { await updateWallet(editingId, draft); toast.success(lang === "ar" ? "تم الحفظ" : "Saved"); }
    cancel();
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{lang === "ar" ? "إدارة المحافظ / طرق الدفع" : "Wallets / Payment Methods"}</h3>
        <button onClick={() => { setCreating(true); setEditingId(null); setDraft(empty); }} className="inline-flex items-center gap-2 rounded-md gradient-red text-primary-foreground px-3 py-2 text-sm font-bold">
          <Plus className="size-4" /> {lang === "ar" ? "إضافة محفظة" : "Add wallet"}
        </button>
      </div>

      {(creating || editingId) && (
        <div className="rounded-xl bg-input/40 p-4 mb-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <label className="text-xs text-muted-foreground block mb-1">{lang === "ar" ? "أيقونة" : "Icon"}</label>
              <div className="relative size-16 rounded-md bg-background border border-border overflow-hidden grid place-items-center">
                {draft.icon && /^https?:\/\//.test(draft.icon) ? (
                  <img src={draft.icon} alt="" className="size-full object-contain" />
                ) : (
                  <span className="text-2xl">{draft.icon || "💳"}</span>
                )}
                <label className="absolute inset-0 cursor-pointer hover:bg-black/40 transition grid place-items-center text-white opacity-0 hover:opacity-100">
                  {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadIcon(f); }} />
                </label>
              </div>
            </div>
            <div className="flex-1 grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">{lang === "ar" ? "الاسم" : "Name"}</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3" placeholder="Movana Wallet" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{lang === "ar" ? "الرقم" : "Number"}</label>
                <input value={draft.number} onChange={(e) => setDraft({ ...draft, number: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3 font-mono" placeholder="0773 123 456" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">{lang === "ar" ? "إيموجي أو رابط أيقونة" : "Emoji or icon URL"}</label>
                <input value={draft.icon ?? ""} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3" placeholder="💳 or https://..." />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
              {lang === "ar" ? "مفعّلة" : "Active"}
            </label>
            <div className="flex gap-2">
              <button onClick={cancel} className="rounded-md bg-secondary px-3 h-10 text-sm">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
              <button onClick={save} className="rounded-md gradient-red text-primary-foreground px-4 h-10 text-sm font-bold">{lang === "ar" ? "حفظ" : "Save"}</button>
            </div>
          </div>
        </div>
      )}

      {wallets.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا توجد محافظ بعد." : "No wallets yet."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3 w-16">{lang === "ar" ? "أيقونة" : "Icon"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الاسم" : "Name"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الرقم" : "Number"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {wallets.map((w) => (
                <tr key={w.id} className="border-t border-border">
                  <td className="p-3">{w.icon && /^https?:\/\//.test(w.icon) ? <img src={w.icon} alt="" className="size-8 object-contain" /> : <span className="text-2xl">{w.icon || "💳"}</span>}</td>
                  <td className="p-3 font-bold">{w.name}</td>
                  <td className="p-3 font-mono">{w.number}</td>
                  <td className="p-3">
                    {w.active
                      ? <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><Check className="size-3" /> {lang === "ar" ? "مفعّلة" : "Active"}</span>
                      : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><X className="size-3" /> {lang === "ar" ? "متوقفة" : "Off"}</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => startEdit(w)} className="inline-flex items-center gap-1 rounded-md bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs"><Pencil className="size-3" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                      <button onClick={() => { if (confirm(lang === "ar" ? "حذف؟" : "Delete?")) deleteWallet(w.id); }} className="inline-flex items-center gap-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30 px-3 py-1.5 text-xs"><Trash2 className="size-3" /> {lang === "ar" ? "حذف" : "Delete"}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
