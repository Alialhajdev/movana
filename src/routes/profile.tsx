import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";

import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useI18n();
  const { user, orders, favorites, findSeries } = useStore();
  const nav = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && !user) nav({ to: "/login", search: { next: "/profile" } });
  }, [user, nav]);

  if (!user) return null;

  const statusClass = (s: string) =>
    s === "delivered" ? "text-emerald-400 bg-emerald-500/10"
    : s === "rejected" ? "text-destructive bg-destructive/10"
    : "text-[var(--gold)] bg-[var(--gold)]/10";

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-5xl px-4 md:px-10">
        <div className="glass rounded-2xl p-6 flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full gradient-red text-2xl font-bold">
            {user.name[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-3xl">{user.name}</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <h2 className="font-display text-2xl mt-10 mb-4">{t("nav_orders")}</h2>
        {orders.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
            {lang === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="glass rounded-xl p-4">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <div className="font-mono text-sm">{o.id}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString(lang === "ar" ? "ar-YE" : "en-US")}</div>
                  </div>
                  <div className="text-primary font-bold">{formatYER(o.total, lang)}</div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(o.status)}`}>
                    {t(`status_${o.status}` as "status_pending")}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {o.items.map((i) => {
                    const s = findSeries(i.seriesId);
                    return s ? <span key={i.seriesId} className="rounded bg-white/5 px-2 py-1">{s.title[lang]} × {i.qty}</span> : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-display text-2xl mt-10 mb-4">{t("nav_favorites")}</h2>
        {favorites.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
            {lang === "ar" ? "لا توجد مفضلات" : "No favorites yet"} · <Link to="/favorites" className="text-primary">{t("view_more")}</Link>
          </div>
        ) : (
          <Link to="/favorites" className="text-primary text-sm">{favorites.length} · {t("view_more")} →</Link>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
