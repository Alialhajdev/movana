import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { useStore, type CategoryItem } from "@/lib/store";

type Draft = { id: string; nameAr: string; nameEn: string; active: boolean };
const empty: Draft = { id: "", nameAr: "", nameEn: "", active: true };

export function CategoriesManager() {
  const { lang } = useI18n();
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategory } = useStore();
  const sorted = [...categories].sort((a, b) => a.order - b.order);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(empty);
  const [creating, setCreating] = useState(false);

  const startEdit = (c: CategoryItem) => {
    setEditingId(c.id);
    setDraft({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn, active: c.active });
    setCreating(false);
  };
  const cancel = () => { setEditingId(null); setCreating(false); setDraft(empty); };

  const save = async () => {
    if (!draft.nameAr.trim() || !draft.nameEn.trim()) {
      toast.error(lang === "ar" ? "الاسم بالعربي والإنجليزي مطلوب" : "Arabic & English names required");
      return;
    }
    if (creating) {
      const id = draft.id.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
      if (!id) { toast.error(lang === "ar" ? "المعرّف مطلوب (إنجليزي)" : "ID required (english slug)"); return; }
      const { error } = await addCategory({ id, nameAr: draft.nameAr.trim(), nameEn: draft.nameEn.trim(), active: draft.active });
      if (error) { toast.error(error); return; }
      toast.success(lang === "ar" ? "تمت الإضافة" : "Added");
    } else if (editingId) {
      await updateCategory(editingId, { nameAr: draft.nameAr, nameEn: draft.nameEn, active: draft.active });
      toast.success(lang === "ar" ? "تم الحفظ" : "Saved");
    }
    cancel();
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">{lang === "ar" ? "إدارة الفئات" : "Categories"}</h3>
        <button onClick={() => { setCreating(true); setEditingId(null); setDraft(empty); }} className="inline-flex items-center gap-2 rounded-md gradient-red text-primary-foreground px-3 py-2 text-sm font-bold">
          <Plus className="size-4" /> {lang === "ar" ? "إضافة فئة" : "Add category"}
        </button>
      </div>

      {(creating || editingId) && (
        <div className="rounded-xl bg-input/40 p-4 mb-4 grid sm:grid-cols-[160px_1fr_1fr_auto_auto] gap-3 items-end">
          <div>
            <label className="text-xs text-muted-foreground">{lang === "ar" ? "المعرف" : "ID (slug)"}</label>
            <input value={draft.id} disabled={!creating} onChange={(e) => setDraft({ ...draft, id: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3 font-mono text-sm disabled:opacity-60" placeholder="korean" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{lang === "ar" ? "الاسم بالعربي" : "Arabic name"}</label>
            <input value={draft.nameAr} onChange={(e) => setDraft({ ...draft, nameAr: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3" placeholder="مسلسلات كورية" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">{lang === "ar" ? "الاسم بالإنجليزي" : "English name"}</label>
            <input value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} className="mt-1 w-full h-10 rounded-md bg-background border border-border px-3" placeholder="Korean Series" />
          </div>
          <label className="inline-flex items-center gap-2 text-sm h-10">
            <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} />
            {lang === "ar" ? "مفعّلة" : "Active"}
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-md gradient-red text-primary-foreground px-3 h-10 text-sm font-bold">{lang === "ar" ? "حفظ" : "Save"}</button>
            <button onClick={cancel} className="rounded-md bg-secondary px-3 h-10 text-sm">{lang === "ar" ? "إلغاء" : "Cancel"}</button>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا توجد فئات" : "No categories"}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3">{lang === "ar" ? "المعرف" : "ID"}</th>
                <th className="text-start p-3">{lang === "ar" ? "عربي" : "Arabic"}</th>
                <th className="text-start p-3">{lang === "ar" ? "إنجليزي" : "English"}</th>
                <th className="text-start p-3">{lang === "ar" ? "الحالة" : "Status"}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{c.id}</td>
                  <td className="p-3">{c.nameAr}</td>
                  <td className="p-3">{c.nameEn}</td>
                  <td className="p-3">
                    {c.active
                      ? <span className="inline-flex items-center gap-1 text-emerald-400 text-xs"><Check className="size-3" /> {lang === "ar" ? "مفعّلة" : "Active"}</span>
                      : <span className="inline-flex items-center gap-1 text-muted-foreground text-xs"><X className="size-3" /> {lang === "ar" ? "متوقفة" : "Off"}</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => startEdit(c)} className="inline-flex items-center gap-1 rounded-md bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs"><Pencil className="size-3" /> {lang === "ar" ? "تعديل" : "Edit"}</button>
                      <button onClick={() => { if (confirm(lang === "ar" ? "حذف؟" : "Delete?")) deleteCategory(c.id); }} className="inline-flex items-center gap-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30 px-3 py-1.5 text-xs"><Trash2 className="size-3" /> {lang === "ar" ? "حذف" : "Delete"}</button>
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
