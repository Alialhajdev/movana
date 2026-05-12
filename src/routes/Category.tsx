import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { SeriesCard } from "@/components/SeriesCard";
import { categoryMeta, type Category } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

const SPECIAL = new Set(["trending", "new", "top"]);

function CategoryPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const { series: allSeries } = useStore();
  const [year, setYear] = useState<string>("all");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<"new" | "rating" | "popular">("new");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let base = SPECIAL.has(slug)
      ? slug === "trending" ? allSeries.filter((s) => s.trending)
        : slug === "new" ? allSeries.filter((s) => s.isNew)
        : allSeries.filter((s) => s.topWatched)
      : allSeries.filter((s) => s.category === (slug as Category));

    if (q.trim()) {
      const needle = q.toLowerCase();
      base = base.filter((s) =>
        s.title.ar.toLowerCase().includes(needle) ||
        s.title.en.toLowerCase().includes(needle)
      );
    }
    if (year !== "all") base = base.filter((s) => s.year === Number(year));
    if (minRating > 0) base = base.filter((s) => s.imdb >= minRating);
    if (sort === "rating") base = [...base].sort((a, b) => b.imdb - a.imdb);
    if (sort === "new") base = [...base].sort((a, b) => b.year - a.year);
    return base;
  }, [slug, q, year, minRating, sort, allSeries]);

  const title = SPECIAL.has(slug)
    ? slug === "trending" ? t("cat_trending") : slug === "new" ? t("cat_new") : t("cat_top")
    : (categoryMeta[slug as Category]?.[lang] ?? slug);

  const years = Array.from(new Set(allSeries.map((s) => s.year))).sort((a, b) => b - a);

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12 pt-24">
        <section className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-background to-background" />
          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 md:px-10 pb-8">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">← {t("nav_home")}</Link>
            <h1 className="font-display text-5xl md:text-7xl text-white">{title}</h1>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-8">
          <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_placeholder")}
              className="flex-1 min-w-[200px] rounded-md bg-input px-3 py-2 text-sm outline-none"
            />
            <select value={year} onChange={(e) => setYear(e.target.value)} className="rounded-md bg-input px-3 py-2 text-sm">
              <option value="all">{t("year")} · {t("all")}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={String(minRating)} onChange={(e) => setMinRating(Number(e.target.value))} className="rounded-md bg-input px-3 py-2 text-sm">
              <option value="0">IMDB · {t("all")}</option>
              <option value="7">7+</option>
              <option value="8">8+</option>
              <option value="9">9+</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "rating" | "popular")} className="rounded-md bg-input px-3 py-2 text-sm">
              <option value="new">{t("cat_new")}</option>
              <option value="rating">IMDB</option>
              <option value="popular">{t("cat_top")}</option>
            </select>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {list.map((s) => (
              <SeriesCard key={s.id} series={s} className="w-full" />
            ))}
            {list.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-20">No results</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
