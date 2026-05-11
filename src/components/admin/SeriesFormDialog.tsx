import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { categoryMeta, type Category, type Series } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const GRADIENTS = [
  "from-rose-700 via-red-900 to-zinc-950",
  "from-amber-700 via-rose-900 to-zinc-950",
  "from-violet-700 via-fuchsia-900 to-zinc-950",
  "from-sky-700 via-indigo-900 to-zinc-950",
  "from-emerald-700 via-teal-900 to-zinc-950",
  "from-orange-700 via-red-950 to-zinc-950",
  "from-pink-700 via-rose-950 to-zinc-950",
  "from-cyan-700 via-blue-950 to-zinc-950",
  "from-yellow-700 via-amber-950 to-zinc-950",
  "from-slate-700 via-zinc-900 to-black",
];

const blank = (): Series => ({
  id: `s-${Date.now().toString(36)}`,
  slug: "",
  title: { ar: "", en: "" },
  description: { ar: "", en: "" },
  category: "korean",
  genres: [],
  year: new Date().getFullYear(),
  imdb: 8,
  seasons: 1,
  episodes: 10,
  source: "Original",
  posterColor: GRADIENTS[0],
  trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  price: 3000,
});

export function SeriesFormDialog({ open, onOpenChange, series }: { open: boolean; onOpenChange: (b: boolean) => void; series: Series | null }) {
  const { t, lang } = useI18n();
  const { addSeries, updateSeries } = useStore();
  const [form, setForm] = useState<Series>(blank());
  const [genresArInput, setGenresArInput] = useState("");
  const [genresEnInput, setGenresEnInput] = useState("");

  useEffect(() => {
    if (open) {
      const f = series ?? blank();
      setForm(f);
      setGenresArInput(f.genres.map((g) => g.ar).join(", "));
      setGenresEnInput(f.genres.map((g) => g.en).join(", "));
    }
  }, [open, series]);

  const set = <K extends keyof Series>(k: K, v: Series[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.title.ar || !form.title.en) { toast.error(lang === "ar" ? "العنوان مطلوب" : "Title required"); return; }
    const arParts = genresArInput.split(",").map((s) => s.trim()).filter(Boolean);
    const enParts = genresEnInput.split(",").map((s) => s.trim()).filter(Boolean);
    const max = Math.max(arParts.length, enParts.length);
    const genres = Array.from({ length: max }, (_, i) => ({ ar: arParts[i] ?? enParts[i] ?? "", en: enParts[i] ?? arParts[i] ?? "" }));
    const payload: Series = { ...form, slug: form.id, genres };
    if (series) { updateSeries(series.id, payload); toast.success(lang === "ar" ? "تم التحديث" : "Updated"); }
    else { addSeries(payload); toast.success(lang === "ar" ? "تمت الإضافة" : "Added"); }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{series ? t("edit") : t("add_series")}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label={t("title_ar")}><Input value={form.title.ar} onChange={(e) => set("title", { ...form.title, ar: e.target.value })} /></Field>
          <Field label={t("title_en")}><Input value={form.title.en} onChange={(e) => set("title", { ...form.title, en: e.target.value })} /></Field>
          <Field label={t("desc_ar")}><Textarea rows={3} value={form.description.ar} onChange={(e) => set("description", { ...form.description, ar: e.target.value })} /></Field>
          <Field label={t("desc_en")}><Textarea rows={3} value={form.description.en} onChange={(e) => set("description", { ...form.description, en: e.target.value })} /></Field>
          <Field label={t("category")}>
            <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className="w-full rounded-md bg-input px-3 py-2 text-sm">
              {(["korean","turkish","english","netflix","appletv"] as Category[]).map((c) => (
                <option key={c} value={c}>{categoryMeta[c][lang]}</option>
              ))}
            </select>
          </Field>
          <Field label={t("source")}><Input value={form.source} onChange={(e) => set("source", e.target.value)} /></Field>
          <Field label={t("genres_ar")}><Input placeholder="دراما, إثارة" value={genresArInput} onChange={(e) => setGenresArInput(e.target.value)} /></Field>
          <Field label={t("genres_en")}><Input placeholder="Drama, Thriller" value={genresEnInput} onChange={(e) => setGenresEnInput(e.target.value)} /></Field>
          <Field label={lang === "ar" ? "السنة" : "Year"}><Input type="number" value={form.year} onChange={(e) => set("year", Number(e.target.value))} /></Field>
          <Field label="IMDB"><Input type="number" step="0.1" value={form.imdb} onChange={(e) => set("imdb", Number(e.target.value))} /></Field>
          <Field label={t("seasons")}><Input type="number" value={form.seasons} onChange={(e) => set("seasons", Number(e.target.value))} /></Field>
          <Field label={t("episodes")}><Input type="number" value={form.episodes} onChange={(e) => set("episodes", Number(e.target.value))} /></Field>
          <Field label={`${t("price")} (YER)`}><Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></Field>
          <Field label={t("trailer_url")}><Input value={form.trailerUrl} onChange={(e) => set("trailerUrl", e.target.value)} /></Field>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">{t("poster_color")}</p>
          <div className="flex flex-wrap gap-2">
            {GRADIENTS.map((g) => (
              <button key={g} type="button" onClick={() => set("posterColor", g)} className={`size-10 rounded bg-gradient-to-br ${g} ring-2 ${form.posterColor === g ? "ring-primary" : "ring-transparent"}`} />
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Toggle label={t("flag_featured")} checked={!!form.featured} onChange={(v) => set("featured", v)} />
          <Toggle label={t("flag_trending")} checked={!!form.trending} onChange={(v) => set("trending", v)} />
          <Toggle label={t("flag_new")} checked={!!form.isNew} onChange={(v) => set("isNew", v)} />
          <Toggle label={t("flag_top")} checked={!!form.topWatched} onChange={(v) => set("topWatched", v)} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={submit} className="gradient-red text-primary-foreground">{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
