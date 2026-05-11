import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { useStore, type Slide } from "@/lib/store";

const GRADIENTS = [
  "from-rose-700 via-red-900 to-zinc-950",
  "from-amber-700 via-rose-900 to-zinc-950",
  "from-violet-700 via-fuchsia-900 to-zinc-950",
  "from-sky-700 via-indigo-900 to-zinc-950",
  "from-emerald-700 via-teal-900 to-zinc-950",
  "from-orange-700 via-red-950 to-zinc-950",
  "from-pink-700 via-rose-950 to-zinc-950",
  "from-cyan-700 via-blue-950 to-zinc-950",
];

export function SlidesManager() {
  const { t, lang } = useI18n();
  const { slides, deleteSlide, updateSlide, reorderSlide } = useStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);

  const sorted = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gradient-red text-primary-foreground">
          <Plus className="size-4" /> {t("add_slide")}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((s, idx) => (
          <div key={s.id} className="glass rounded-xl overflow-hidden">
            <div className={`aspect-video bg-gradient-to-br ${s.gradient} relative`}>
              <div className="absolute inset-0 flex items-end p-4">
                <p className="text-white font-display text-xl text-shadow-hero line-clamp-2">{lang === "ar" ? s.titleAr : s.titleEn}</p>
              </div>
            </div>
            <div className="p-3 space-y-2">
              <p className="text-xs text-muted-foreground line-clamp-2">{lang === "ar" ? s.subtitleAr : s.subtitleEn}</p>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs">
                  <Switch checked={s.active} onCheckedChange={(v) => updateSlide(s.id, { active: v })} />
                  {t("active")}
                </label>
                <div className="flex gap-1">
                  <button disabled={idx === 0} onClick={() => reorderSlide(s.id, -1)} className="grid size-7 place-items-center rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronUp className="size-4" /></button>
                  <button disabled={idx === sorted.length - 1} onClick={() => reorderSlide(s.id, 1)} className="grid size-7 place-items-center rounded-md bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronDown className="size-4" /></button>
                  <button onClick={() => { setEditing(s); setOpen(true); }} className="grid size-7 place-items-center rounded-md bg-white/5 hover:bg-white/10"><Pencil className="size-4" /></button>
                  <button onClick={() => { if (confirm(t("confirm_delete"))) deleteSlide(s.id); }} className="grid size-7 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="col-span-full p-10 text-center text-muted-foreground glass rounded-xl">{t("no_data")}</p>}
      </div>

      <SlideForm open={open} onOpenChange={setOpen} slide={editing} />
    </div>
  );
}

function SlideForm({ open, onOpenChange, slide }: { open: boolean; onOpenChange: (b: boolean) => void; slide: Slide | null }) {
  const { t, lang } = useI18n();
  const { addSlide, updateSlide, series } = useStore();
  const [form, setForm] = useState<Slide>({
    id: "", titleAr: "", titleEn: "", subtitleAr: "", subtitleEn: "",
    gradient: GRADIENTS[0], active: true, order: 0,
  });

  useEffect(() => {
    if (open) {
      setForm(slide ?? {
        id: "", titleAr: "", titleEn: "", subtitleAr: "", subtitleEn: "",
        gradient: GRADIENTS[0], active: true, order: 0,
      });
    }
  }, [open, slide]);

  const set = <K extends keyof Slide>(k: K, v: Slide[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onPickSeries = (id: string) => {
    if (!id) { set("seriesId", undefined); return; }
    const sx = series.find((x) => x.id === id);
    if (!sx) return;
    setForm((f) => ({
      ...f,
      seriesId: id,
      titleAr: f.titleAr || sx.title.ar,
      titleEn: f.titleEn || sx.title.en,
      subtitleAr: f.subtitleAr || sx.description.ar,
      subtitleEn: f.subtitleEn || sx.description.en,
      gradient: f.gradient || sx.posterColor,
    }));
  };

  const submit = () => {
    if (slide) updateSlide(slide.id, form);
    else addSlide({
      titleAr: form.titleAr, titleEn: form.titleEn,
      subtitleAr: form.subtitleAr, subtitleEn: form.subtitleEn,
      gradient: form.gradient, image: form.image, seriesId: form.seriesId,
      ctaUrl: form.ctaUrl, active: form.active,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{slide ? t("edit") : t("add_slide")}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{t("link_to_series")}</span>
            <select value={form.seriesId || ""} onChange={(e) => onPickSeries(e.target.value)} className="w-full rounded-md bg-input px-3 py-2 text-sm">
              <option value="">{t("none")}</option>
              {series.map((s) => <option key={s.id} value={s.id}>{s.title[lang]}</option>)}
            </select>
          </label>
          <div className="grid md:grid-cols-2 gap-3">
            <FieldSet label={t("title_ar")}><Input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)} /></FieldSet>
            <FieldSet label={t("title_en")}><Input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} /></FieldSet>
            <FieldSet label={`${t("subtitle")} (AR)`}><Textarea rows={2} value={form.subtitleAr} onChange={(e) => set("subtitleAr", e.target.value)} /></FieldSet>
            <FieldSet label={`${t("subtitle")} (EN)`}><Textarea rows={2} value={form.subtitleEn} onChange={(e) => set("subtitleEn", e.target.value)} /></FieldSet>
            <FieldSet label="Image URL"><Input value={form.image || ""} onChange={(e) => set("image", e.target.value)} /></FieldSet>
            <FieldSet label="CTA URL"><Input value={form.ctaUrl || ""} onChange={(e) => set("ctaUrl", e.target.value)} /></FieldSet>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">{t("poster_color")}</p>
            <div className="flex flex-wrap gap-2">
              {GRADIENTS.map((g) => (
                <button key={g} type="button" onClick={() => set("gradient", g)} className={`size-10 rounded bg-gradient-to-br ${g} ring-2 ${form.gradient === g ? "ring-primary" : "ring-transparent"}`} />
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
            <span className="text-sm">{t("active")}</span>
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={submit} className="gradient-red text-primary-foreground">{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FieldSet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      {children}
    </label>
  );
}
