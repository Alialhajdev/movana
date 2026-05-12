import { useMemo } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { HeroSlider } from "@/components/HeroSlider";
import { SeriesRow } from "@/components/SeriesRow";
import { OffersSection } from "@/components/OffersSection";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function Index() {
  const { t } = useI18n();
  const { series } = useStore();
  const trending = useMemo(() => series.filter((s) => s.trending), [series]);
  const newest = useMemo(() => series.filter((s) => s.isNew), [series]);
  const top = useMemo(() => series.filter((s) => s.topWatched), [series]);
  const k = useMemo(() => series.filter((s) => s.category === "korean"), [series]);
  const tr = useMemo(() => series.filter((s) => s.category === "turkish"), [series]);
  const en = useMemo(() => series.filter((s) => s.category === "english"), [series]);
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <HeroSlider />
        <div className="-mt-20 relative z-10">
          <OffersSection />
          {trending.length > 0 && <SeriesRow title={t("cat_trending")} items={trending} viewMoreTo="/category/trending" />}
          {k.length > 0 && <SeriesRow title={t("cat_korean")} items={k} viewMoreTo="/category/korean" />}
          {tr.length > 0 && <SeriesRow title={t("cat_turkish")} items={tr} viewMoreTo="/category/turkish" />}
          {en.length > 0 && <SeriesRow title={t("cat_english")} items={en} viewMoreTo="/category/english" />}
          {newest.length > 0 && <SeriesRow title={t("cat_new")} items={newest} viewMoreTo="/category/new" />}
          {top.length > 0 && <SeriesRow title={t("cat_top")} items={top} viewMoreTo="/category/trending" />}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
