import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categoryMeta, type Category, type Series } from "@/lib/data";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { SeriesFormDialog } from "./SeriesFormDialog";

export function SeriesManager() {
  const { t, lang } = useI18n();
  const { series, deleteSeries } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Category>("all");
  const [editing, setEditing] = useState<Series | null>(null);
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    let base = series;
    if (cat !== "all") base = base.filter((s) => s.category === cat);
    if (q.trim()) {
      const n = q.toLowerCase();
      base = base.filter((s) => s.title.ar.toLowerCase().includes(n) || s.title.en.toLowerCase().includes(n));
    }
    return base;
  }, [series, cat, q]);

  const onAdd = () => { setEditing(null); setOpen(true); };
  const onEdit = (s: Series) => { setEditing(s); setOpen(true); };
  const onDelete = (s: Series) => {
    if (confirm(t("confirm_delete") + "\n" + s.title[lang])) deleteSeries(s.id);
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-md bg-input px-3 py-2 flex-1 min-w-[200px]">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value as Category | "all")} className="rounded-md bg-input px-3 py-2 text-sm">
          <option value="all">{t("all")}</option>
          {(["korean","turkish","english","netflix","appletv"] as Category[]).map((c) => (
            <option key={c} value={c}>{categoryMeta[c][lang]}</option>
          ))}
        </select>
        <Button onClick={onAdd} className="gradient-red text-primary-foreground"><Plus className="size-4" /> {t("add_series")}</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-start p-3">{lang === "ar" ? "المسلسل" : "Title"}</th>
              <th className="text-start p-3">{t("category")}</th>
              <th className="text-start p-3">IMDB</th>
              <th className="text-start p-3">{lang === "ar" ? "السنة" : "Year"}</th>
              <th className="text-start p-3">{t("price")}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">{t("no_data")}</td></tr>
            )}
            {list.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded bg-gradient-to-br ${s.posterColor}`} />
                    <div>
                      <p className="font-medium">{s.title[lang]}</p>
                      <p className="text-xs text-muted-foreground">{s.title[lang === "ar" ? "en" : "ar"]}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-xs">{categoryMeta[s.category][lang]}</td>
                <td className="p-3">{s.imdb}</td>
                <td className="p-3">{s.year}</td>
                <td className="p-3 text-primary font-bold">{formatYER(s.price, lang)}</td>
                <td className="p-3">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => onEdit(s)} className="grid size-8 place-items-center rounded-md bg-white/5 hover:bg-white/10" title={t("edit")}><Pencil className="size-4" /></button>
                    <button onClick={() => onDelete(s)} className="grid size-8 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30" title={t("delete")}><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SeriesFormDialog open={open} onOpenChange={setOpen} series={editing} />
    </div>
  );
}
