import { createFileRoute, Link } from "@tanstack/react-router";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { SeriesCard } from "@/components/SeriesCard";
import { findSeries } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  component: FavoritesPage,
});

function FavoritesPage() {
  const { t, lang } = useI18n();
  const { favorites } = useStore();
  const list = favorites.map(findSeries).filter(Boolean);

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-[1600px] px-4 md:px-10">
        <h1 className="font-display text-4xl mb-6">{t("nav_favorites")}</h1>
        {list.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {lang === "ar" ? "لم تقم بإضافة مفضلات بعد" : "You haven't added any favorites yet"}
            </p>
            <Link to="/" className="inline-block rounded-md gradient-red px-5 py-2.5 text-sm font-bold">{t("continue_shopping")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {list.map((s) => s && <SeriesCard key={s.id} series={s} className="w-full" />)}
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
