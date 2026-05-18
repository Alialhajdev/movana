import { useMemo } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { HeroSlider } from "@/components/HeroSlider";
import { SeriesRow } from "@/components/SeriesRow";
import { OffersSection } from "@/components/OffersSection";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function Index() {
  const { t, lang } = useI18n();
  const { series, categories } = useStore();
  const trending = useMemo(() => series.filter((s) => s.trending), [series]);
  const newest = useMemo(() => series.filter((s) => s.isNew), [series]);
  const top = useMemo(() => series.filter((s) => s.topWatched), [series]);
  const sortedCats = useMemo(
    () => [...categories].filter((c) => c.active).sort((a, b) => a.order - b.order),
    [categories]
  );
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <HeroSlider />
        <div className="-mt-20 relative z-10">
          <OffersSection />
          {trending.length > 0 && <SeriesRow title={t("cat_trending")} items={trending} viewMoreTo="/category/trending" />}
          {sortedCats.map((c) => {
            const items = series.filter((s) => s.category === c.id);
            if (items.length === 0) return null;
            return (
              <SeriesRow
                key={c.id}
                title={lang === "ar" ? c.nameAr : c.nameEn}
                items={items}
                viewMoreTo={`/category/${c.id}`}
              />
            );
          })}
          {newest.length > 0 && <SeriesRow title={t("cat_new")} items={newest} viewMoreTo="/category/new" />}
          {top.length > 0 && <SeriesRow title={t("cat_top")} items={top} viewMoreTo="/category/trending" />}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
