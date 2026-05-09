import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { HeroSlider } from "@/components/HeroSlider";
import { SeriesRow } from "@/components/SeriesRow";
import { byCategory, trending, newest, topWatched } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Movana — اكتشف أفضل المسلسلات" },
      { name: "description", content: "تصفح أفضل المسلسلات الكورية والتركية والأجنبية واطلبها بالعملة اليمنية." },
    ],
  }),
});

function Index() {
  const { t } = useI18n();
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <HeroSlider />
        <div className="-mt-20 relative z-10">
          <SeriesRow title={t("cat_trending")} items={trending()} viewMoreTo="/category/trending" />
          <SeriesRow title={t("cat_korean")} items={byCategory("korean")} viewMoreTo="/category/korean" />
          <SeriesRow title={t("cat_turkish")} items={byCategory("turkish")} viewMoreTo="/category/turkish" />
          <SeriesRow title={t("cat_english")} items={byCategory("english")} viewMoreTo="/category/english" />
          <SeriesRow title={t("cat_new")} items={newest()} viewMoreTo="/category/new" />
          <SeriesRow title={t("cat_top")} items={topWatched()} viewMoreTo="/category/trending" />
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
