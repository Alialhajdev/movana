import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Heart, Play, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { categoryMeta } from "@/lib/data";
import { useI18n, formatYER } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import { cn } from "@/lib/utils";

const heroes = [hero1, hero2, hero3];

export function HeroSlider() {
  const { lang, t, dir } = useI18n();
  const { addToCart, toggleFavorite, isFavorite, slides, findSeries } = useStore();
  const items = useMemo(
    () => [...slides].filter((s) => s.active).sort((a, b) => a.order - b.order),
    [slides]
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [items.length]);

  const current = items[i % Math.max(items.length, 1)];
  if (!current) return null;
  const linked = current.seriesId ? findSeries(current.seriesId) : undefined;
  const fav = linked ? isFavorite(linked.id) : false;

  return (
    <section className="relative h-[78vh] min-h-[560px] w-full overflow-hidden bg-black">
      {items.map((s, idx) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="hero-overlay relative h-full w-full">
            {s.image ? (
              <img src={s.image} alt="" className="h-full w-full object-cover object-top animate-ken-burns" />
            ) : (
              <>
                <img src={heroes[idx % heroes.length]} alt="" className="h-full w-full object-cover animate-ken-burns" />
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60 mix-blend-multiply", s.gradient)} />
              </>
            )}
          </div>
        </div>
      ))}

      <div className="relative z-10 flex h-full items-end md:items-center">
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-10 pb-16 md:pb-0">
          <div key={current.id} className="max-w-2xl animate-fade-up">
            {linked && (
              <span className="inline-block rounded-full gradient-red px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-glow">
                {categoryMeta[linked.category][lang]}
              </span>
            )}
            <h1 className="font-display mt-4 text-5xl md:text-7xl leading-none text-white text-shadow-hero">
              {lang === "ar" ? current.titleAr : current.titleEn}
            </h1>
            {linked && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-1 rounded bg-[var(--gold)]/15 px-2 py-1 text-[var(--gold)]">
                  <Star className="size-3.5 fill-current" /> IMDb {linked.imdb}
                </span>
                <span>{linked.year}</span>
                <span>· {linked.seasons} {t("seasons")}</span>
                <span>· {linked.episodes} {t("episodes")}</span>
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{linked.source}</span>
              </div>
            )}
            <p className="mt-4 max-w-xl text-base md:text-lg text-white/80 line-clamp-3 text-shadow-hero">
              {lang === "ar" ? current.subtitleAr : current.subtitleEn}
            </p>
            {linked && (
              <div className="mt-2 text-lg font-bold text-white">{formatYER(linked.price, lang)}</div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {linked ? (
                <>
                  <Link
                    to={`/series/${linked.id}`}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-black hover:bg-white/90 transition"
                  >
                    <Play className="size-4 fill-current" />
                    {t("hero_watch_trailer")}
                  </Link>
                  <button
                    onClick={() => addToCart(linked.id)}
                    className="inline-flex items-center gap-2 rounded-md gradient-red px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition"
                  >
                    <ShoppingCart className="size-4" />
                    {t("hero_add_cart")}
                  </button>
                  <button
                    onClick={() => toggleFavorite(linked.id)}
                    aria-label={t("hero_add_fav")}
                    className="grid size-12 place-items-center rounded-full glass hover:bg-white/10 transition"
                  >
                    <Heart className={cn("size-5", fav && "fill-primary text-primary")} />
                  </button>
                </>
              ) : current.ctaUrl ? (
                <a
                  href={current.ctaUrl}
                  className="inline-flex items-center gap-2 rounded-md gradient-red px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition"
                >
                  {t("view_more")}
                </a>
              ) : null}
              <Link
                to="/requests"
                className="inline-flex items-center gap-2 rounded-md glass px-5 py-3 text-sm font-bold hover:bg-white/10 transition"
              >
                {t("nav_requests")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            aria-label="prev"
            onClick={() => setI((x) => (x - 1 + items.length) % items.length)}
            className="absolute start-4 top-1/2 z-20 hidden md:grid -translate-y-1/2 size-12 place-items-center rounded-full glass hover:bg-primary transition"
          >
            {dir === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </button>
          <button
            aria-label="next"
            onClick={() => setI((x) => (x + 1) % items.length)}
            className="absolute end-4 top-1/2 z-20 hidden md:grid -translate-y-1/2 size-12 place-items-center rounded-full glass hover:bg-primary transition"
          >
            {dir === "rtl" ? <ChevronLeft /> : <ChevronRight />}
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                aria-label={`slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === i ? "w-8 bg-primary" : "w-3 bg-white/40"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
