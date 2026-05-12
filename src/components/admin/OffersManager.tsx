import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/lib/i18n";
import { useStore, type Offer } from "@/lib/store";
import { cn } from "@/lib/utils";

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

export function OffersManager() {
  const { t, lang } = useI18n();
  const { offers, addOffer, updateOffer, deleteOffer, reorderOffer } = useStore();
  const [editing, setEditing] = useState<Offer | null>(null);
  const [open, setOpen] = useState(false);

  const sorted = [...offers].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t("admin_offers")}</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button className="gradient-red" onClick={() => setEditing(null)}>
              <Plus className="size-4 me-1" /> {t("add_offer")}
            </Button>
          </DialogTrigger>
          <OfferForm
            initial={editing}
            onClose={() => { setOpen(false); setEditing(null); }}
            onSave={(data) => {
              if (editing) {
                updateOffer(editing.id, data);
                toast.success(lang === "ar" ? "تم التحديث" : "Updated");
              } else {
                addOffer({ ...data, active: data.active ?? true });
                toast.success(lang === "ar" ? "تمت الإضافة" : "Added");
              }
              setOpen(false); setEditing(null);
            }}
          />
        </Dialog>
      </div>

      {sorted.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">{t("no_data")}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map((o) => (
            <div key={o.id} className="glass rounded-2xl overflow-hidden">
              <div className={cn("h-28 bg-gradient-to-br relative", o.gradient)}>
                {typeof o.discountPct === "number" && o.discountPct > 0 && (
                  <span className="absolute top-3 end-3 rounded-md bg-white text-black px-2 py-1 text-sm font-extrabold">-{o.discountPct}%</span>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold line-clamp-1">{lang === "ar" ? o.titleAr : o.titleEn}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{lang === "ar" ? o.descriptionAr : o.descriptionEn}</p>
                  </div>
                  <Switch checked={o.active} onCheckedChange={(v) => updateOffer(o.id, { active: v })} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => reorderOffer(o.id, -1)}><ArrowUp className="size-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => reorderOffer(o.id, 1)}><ArrowDown className="size-4" /></Button>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(o); setOpen(true); }}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => {
                      if (confirm(t("confirm_delete"))) { deleteOffer(o.id); toast.success(lang === "ar" ? "تم الحذف" : "Deleted"); }
                    }}><Trash2 className="size-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OfferForm({ initial, onClose, onSave }: {
  initial: Offer | null;
  onClose: () => void;
  onSave: (data: Omit<Offer, "id" | "order">) => void;
}) {
  const { t, lang } = useI18n();
  const { series } = useStore();
  const [titleAr, setTitleAr] = useState(initial?.titleAr ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [descriptionAr, setDescriptionAr] = useState(initial?.descriptionAr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initial?.descriptionEn ?? "");
  const [badgeAr, setBadgeAr] = useState(initial?.badgeAr ?? "");
  const [badgeEn, setBadgeEn] = useState(initial?.badgeEn ?? "");
  const [discountPct, setDiscountPct] = useState<string>(initial?.discountPct?.toString() ?? "");
  const [gradient, setGradient] = useState(initial?.gradient ?? GRADIENTS[0]);
  const [ctaUrl, setCtaUrl] = useState(initial?.ctaUrl ?? "");
  const [seriesId, setSeriesId] = useState(initial?.seriesId ?? "");
  const [active, setActive] = useState(initial?.active ?? true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn) return;
    onSave({
      titleAr, titleEn, descriptionAr, descriptionEn,
      badgeAr: badgeAr || undefined,
      badgeEn: badgeEn || undefined,
      discountPct: discountPct ? Number(discountPct) : undefined,
      gradient,
      ctaUrl: ctaUrl || undefined,
      seriesId: seriesId || undefined,
      active,
    });
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{initial ? t("edit") : t("add_offer")}</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={t("title_ar")} value={titleAr} onChange={setTitleAr} required />
          <Field label={t("title_en")} value={titleEn} onChange={setTitleEn} required />
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <TextField label={t("desc_ar")} value={descriptionAr} onChange={setDescriptionAr} />
          <TextField label={t("desc_en")} value={descriptionEn} onChange={setDescriptionEn} />
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <Field label={t("offer_badge_ar")} value={badgeAr} onChange={setBadgeAr} />
          <Field label={t("offer_badge_en")} value={badgeEn} onChange={setBadgeEn} />
          <Field label={t("offer_discount")} type="number" value={discountPct} onChange={setDiscountPct} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">{t("poster_color")}</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1">
            {GRADIENTS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradient(g)}
                className={cn("h-10 rounded-md bg-gradient-to-br border-2", g, gradient === g ? "border-primary ring-2 ring-primary/40" : "border-transparent")}
              />
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <Field label={t("offer_cta_url")} value={ctaUrl} onChange={setCtaUrl} placeholder="/category/korean" />
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("link_to_series")}</label>
            <select value={seriesId} onChange={(e) => setSeriesId(e.target.value)} className="w-full rounded-md bg-input px-3 py-2 text-sm">
              <option value="">{t("none")}</option>
              {series.map((s) => <option key={s.id} value={s.id}>{s.title[lang]}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-3 pt-2">
          <Switch checked={active} onCheckedChange={setActive} />
          <span className="text-sm">{t("active")}</span>
        </label>
        <DialogFooter className="pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>{t("cancel")}</Button>
          <Button type="submit" className="gradient-red">{t("save")}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function Field({ label, value, onChange, type = "text", required, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      <Input type={type} value={value} required={required} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
    </label>
  );
}
