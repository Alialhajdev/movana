import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Heart, Play, Share2, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { SeriesRow } from "@/components/SeriesRow";
import { categoryMeta } from "@/lib/data";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/series/$id")({
  component: SeriesDetail,
});

function SeriesDetail() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { addToCart, toggleFavorite, isFavorite, findSeries, series: allSeries } = useStore();
  const s = findSeries(id);
  const related = useMemo(
    () => (s ? allSeries.filter((x) => x.category === s.category && x.id !== s.id) : []),
    [s, allSeries]
  );
  if (!s) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 mx-auto max-w-[1600px] px-4 md:px-10 text-center text-muted-foreground">
          {lang === "ar" ? "المسلسل غير موجود" : "Series not found"}
        </main>
        <Footer />
      </>
    );
  }
  const fav = isFavorite(s.id);

  const share = () => {
    if (navigator.share) navigator.share({ title: s.title[lang], url: window.location.href }).catch(() => {});
    else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  };

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12">
        <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-br animate-ken-burns", s.posterColor)} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-end px-4 md:px-10 pb-12">
            <div className="max-w-3xl">
              <Link to="/category/$slug" params={{ slug: s.category }} className="inline-block rounded-full gradient-red px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {categoryMeta[s.category][lang]}
              </Link>
              <h1 className="font-display mt-4 text-5xl md:text-7xl text-white text-shadow-hero">{s.title[lang]}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded bg-[var(--gold)]/15 px-2 py-1 text-[var(--gold)]">
                  <Star className="size-3.5 fill-current" /> IMDb {s.imdb}
                </span>
                <span>{s.year}</span>
                <span>· {s.seasons} {t("seasons")}</span>
                <span>· {s.episodes} {t("episodes")}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{s.source}</span>
                {s.genres.map((g) => (
                  <span key={g.en} className="rounded bg-white/5 px-2 py-0.5 text-xs">{g[lang]}</span>
                ))}
              </div>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/85">{s.description[lang]}</p>
              <div className="mt-3 text-2xl font-bold text-white">{formatYER(s.price, lang)}</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => { addToCart(s.id); toast.success(lang === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart"); }}
                  className="inline-flex items-center gap-2 rounded-md gradient-red px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition"
                >
                  <ShoppingCart className="size-4" /> {t("hero_add_cart")}
                </button>
                <button
                  onClick={() => toggleFavorite(s.id)}
                  className="inline-flex items-center gap-2 rounded-md glass px-5 py-3 text-sm font-bold hover:bg-white/10"
                >
                  <Heart className={cn("size-4", fav && "fill-primary text-primary")} /> {t("hero_add_fav")}
                </button>
                <button onClick={share} className="grid size-12 place-items-center rounded-full glass hover:bg-white/10">
                  <Share2 className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-12">
          <h2 className="font-display text-3xl mb-4 flex items-center gap-2"><Play className="size-6 text-primary fill-current" /> {t("trailer")}</h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-card">
            <iframe
              src={s.trailerUrl}
              title="trailer"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-12">
          <h2 className="font-display text-3xl mb-4">{t("screenshots")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn("aspect-video rounded-lg bg-gradient-to-br shadow-card overflow-hidden cursor-pointer transition hover:scale-105", s.posterColor)}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-12">
          <h2 className="font-display text-3xl">{t("reviews")}</h2>
          <div className="mt-4 glass rounded-2xl p-6 space-y-4">
            {[
              { name: "أحمد", text: lang === "ar" ? "إخراج رائع وقصة لا تُنسى!" : "Brilliant direction and unforgettable story!", r: 5 },
              { name: "Sara", text: lang === "ar" ? "من أفضل ما شاهدت هذا العام." : "One of the best things I watched this year.", r: 4 },
            ].map((rev, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{rev.name}</span>
                  <span className="flex text-[var(--gold)]">
                    {Array.from({ length: rev.r }).map((_, idx) => <Star key={idx} className="size-4 fill-current" />)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rev.text}</p>
              </div>
            ))}
          </div>
        </section>

        <SeriesRow title={t("related")} items={related} />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
