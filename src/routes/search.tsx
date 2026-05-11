import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { SeriesCard } from "@/components/SeriesCard";
import { categoryMeta } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/search")({
  component: SearchPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "" }),
});

function SearchPage() {
  const { q: initial } = Route.useSearch();
  const [q, setQ] = useState(initial);
  const { t, lang } = useI18n();
  const { series: allSeries } = useStore();

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return allSeries.filter((s) =>
      s.title.ar.toLowerCase().includes(needle) ||
      s.title.en.toLowerCase().includes(needle) ||
      s.genres.some((g) => g.ar.toLowerCase().includes(needle) || g.en.toLowerCase().includes(needle)) ||
      categoryMeta[s.category].ar.toLowerCase().includes(needle) ||
      categoryMeta[s.category].en.toLowerCase().includes(needle) ||
      String(s.year).includes(needle)
    );
  }, [q]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-[1600px] px-4 md:px-10">
        <div className="glass rounded-full flex items-center gap-3 px-5 py-3">
          <Search className="size-5 text-primary" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="flex-1 bg-transparent text-lg outline-none"
          />
        </div>

        <div className="mt-8">
          {q && <p className="text-sm text-muted-foreground mb-4">{results.length} {lang === "ar" ? "نتيجة" : "results"}</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((s) => <SeriesCard key={s.id} series={s} className="w-full" />)}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
