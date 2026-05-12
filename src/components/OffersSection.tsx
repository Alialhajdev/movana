import { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, Sparkles, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore, type Offer } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function OffersSection() {
  const { t, lang, dir } = useI18n();
  const { offers } = useStore();
  const [active, setActive] = useState<Offer | null>(null);

  const visible = [...offers]
    .filter((o) => o.active && (!o.expiresAt || o.expiresAt > Date.now()))
    .sort((a, b) => a.order - b.order);

  if (visible.length === 0) return null;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-8">
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full gradient-red text-primary-foreground shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <h2 className="font-display text-2xl md:text-3xl text-foreground">{t("offers_title")}</h2>
        </div>
        <span className="text-xs text-muted-foreground">{visible.length} {t("offers_count")}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {visible.map((o) => {
          const title = lang === "ar" ? o.titleAr : o.titleEn;
          const desc = lang === "ar" ? o.descriptionAr : o.descriptionEn;
          const badge = lang === "ar" ? o.badgeAr : o.badgeEn;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => setActive(o)}
              className="group relative overflow-hidden rounded-2xl shadow-card card-hover min-h-[180px] flex text-start"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", o.gradient)} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
              <div className="relative z-10 flex flex-col justify-between p-5 w-full">
                <div className="flex items-start justify-between gap-2">
                  {badge && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <Tag className="size-3" /> {badge}
                    </span>
                  )}
                  {typeof o.discountPct === "number" && o.discountPct > 0 && (
                    <span className="rounded-md bg-white text-black px-2.5 py-1 text-sm font-extrabold">
                      -{o.discountPct}%
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-white text-shadow-hero leading-tight">{title}</h3>
                  <p className="mt-2 text-sm text-white/85 line-clamp-2">{desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white">
                    {t("offer_view")} <Arrow className="size-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {active && (
            <>
              <div className={cn("relative h-40 bg-gradient-to-br", active.gradient)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
                <div className="absolute inset-0 p-5 flex items-end justify-between">
                  {(lang === "ar" ? active.badgeAr : active.badgeEn) && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/50 backdrop-blur px-3 py-1 text-xs font-bold text-white">
                      <Tag className="size-3" /> {lang === "ar" ? active.badgeAr : active.badgeEn}
                    </span>
                  )}
                  {typeof active.discountPct === "number" && active.discountPct > 0 && (
                    <span className="rounded-md bg-white text-black px-3 py-1.5 text-lg font-extrabold">
                      -{active.discountPct}%
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    {lang === "ar" ? active.titleAr : active.titleEn}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "ar" ? active.descriptionAr : active.descriptionEn}
                </p>
                <DialogFooter className="pt-2">
                  <button
                    onClick={() => setActive(null)}
                    className="rounded-md px-4 py-2 text-sm hover:bg-white/5"
                  >
                    {t("cancel")}
                  </button>
                  {(active.ctaUrl || active.seriesId) && (
                    <Link
                      to={active.seriesId ? `/series/${active.seriesId}` : (active.ctaUrl || "/")}
                      onClick={() => setActive(null)}
                      className="inline-flex items-center gap-2 rounded-md gradient-red px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow"
                    >
                      <ShoppingBag className="size-4" />
                      {t("offers_cta")}
                    </Link>
                  )}
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
