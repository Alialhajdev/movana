import { useEffect, useState } from "react";
import { Trash2, Star, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { useStore, type Review } from "@/lib/store";
import { toast } from "sonner";

export function ReviewsManager() {
  const { t, lang } = useI18n();
  const { findSeries } = useStore();
  const [items, setItems] = useState<Review[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    const list: Review[] = (data ?? []).map((r: any) => ({
      id: r.id, seriesId: r.series_id, userId: r.user_id, userName: r.user_name ?? "",
      rating: Number(r.rating), comment: r.comment ?? "", createdAt: new Date(r.created_at).getTime(),
    }));
    setItems(list);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm(t("confirm_delete"))) return;
    await supabase.from("reviews").delete().eq("id", id);
    setItems((arr) => arr.filter((r) => r.id !== id));
    toast.success(lang === "ar" ? "تم الحذف" : "Deleted");
  };

  const list = items.filter((r) => {
    if (!q.trim()) return true;
    const n = q.toLowerCase();
    const s = findSeries(r.seriesId);
    return r.comment.toLowerCase().includes(n) || r.userName.toLowerCase().includes(n) || (s?.title.ar.toLowerCase().includes(n)) || (s?.title.en.toLowerCase().includes(n));
  });

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold flex-1">{lang === "ar" ? "المراجعات" : "Reviews"}</h3>
        <div className="flex items-center gap-2 rounded-md bg-input px-3 py-2 min-w-[200px]">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="bg-transparent outline-none flex-1 text-sm" />
        </div>
      </div>
      {loading ? (
        <p className="p-10 text-center text-muted-foreground">...</p>
      ) : list.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{t("no_data")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3">{lang === "ar" ? "المسلسل" : "Series"}</th>
                <th className="text-start p-3">{lang === "ar" ? "المستخدم" : "User"}</th>
                <th className="text-start p-3">{lang === "ar" ? "التقييم" : "Rating"}</th>
                <th className="text-start p-3">{lang === "ar" ? "التعليق" : "Comment"}</th>
                <th className="text-start p-3">{lang === "ar" ? "التاريخ" : "Date"}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const s = findSeries(r.seriesId);
                return (
                  <tr key={r.id} className="border-t border-border align-top">
                    <td className="p-3 font-medium">{s ? s.title[lang] : r.seriesId}</td>
                    <td className="p-3 text-xs">{r.userName}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[var(--gold)]">
                        <Star className="size-3.5 fill-current" /> {r.rating}
                      </span>
                    </td>
                    <td className="p-3 max-w-md text-xs text-muted-foreground">{r.comment}</td>
                    <td className="p-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString(lang === "ar" ? "ar-YE" : "en-US")}</td>
                    <td className="p-3">
                      <button onClick={() => remove(r.id)} className="grid size-8 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30" title={t("delete")}>
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
