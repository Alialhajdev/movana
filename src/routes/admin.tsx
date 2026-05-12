import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Film, ImageIcon, MessageSquare, Settings as SettingsIcon, ShoppingBag, Sparkles, Users, Wallet } from "lucide-react";
import { Header, Footer } from "@/components/Layout";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { SeriesManager } from "@/components/admin/SeriesManager";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { PaymentsManager } from "@/components/admin/PaymentsManager";
import { RequestsManager } from "@/components/admin/RequestsManager";
import { SlidesManager } from "@/components/admin/SlidesManager";
import { OffersManager } from "@/components/admin/OffersManager";
import { SettingsManager } from "@/components/admin/SettingsManager";

type Tab = "dashboard" | "series" | "offers" | "orders" | "payments" | "requests" | "slides" | "settings";

export default function AdminPage() {
  const { t, lang } = useI18n();
  const { user, orders, series, requests, offers } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!user || !user.isAdmin) nav("/login?next=/admin");
  }, [user, nav]);

  const stats = useMemo(() => {
    const revenue = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
    const uniqueCustomers = new Set(orders.map((o) => o.customerEmail).filter(Boolean)).size;
    return {
      users: Math.max(uniqueCustomers, 1),
      orders: orders.length,
      seriesCount: series.length,
      revenue,
      pendingPayments: orders.filter((o) => o.paymentMethod === "wallet_transfer" && o.status === "pending").length,
      openRequests: requests.filter((r) => r.status === "open").length,
      activeOffers: offers.filter((o) => o.active).length,
    };
  }, [orders, series, requests, offers]);

  if (!user || !user.isAdmin) return null;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "dashboard", label: t("admin_dashboard"), icon: <BarChart3 className="size-4" /> },
    { id: "series", label: t("admin_series"), icon: <Film className="size-4" /> },
    { id: "offers", label: t("admin_offers"), icon: <Sparkles className="size-4" />, badge: stats.activeOffers },
    { id: "orders", label: t("admin_orders"), icon: <ShoppingBag className="size-4" />, badge: orders.length },
    { id: "payments", label: t("admin_payments"), icon: <Wallet className="size-4" />, badge: stats.pendingPayments },
    { id: "requests", label: t("admin_requests"), icon: <MessageSquare className="size-4" />, badge: stats.openRequests },
    { id: "slides", label: t("admin_slides"), icon: <ImageIcon className="size-4" /> },
    { id: "settings", label: t("admin_settings"), icon: <SettingsIcon className="size-4" /> },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 mx-auto max-w-[1600px] px-4 md:px-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-4xl">{t("nav_admin")}</h1>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← {t("nav_home")}</Link>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          <aside className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-24">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition",
                    tab === tb.id ? "gradient-red text-primary-foreground shadow-glow" : "hover:bg-white/5 text-muted-foreground"
                  )}
                >
                  {tb.icon}
                  <span className="flex-1 text-start">{tb.label}</span>
                  {tb.badge ? (
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", tab === tb.id ? "bg-white/20" : "bg-primary/20 text-primary")}>{tb.badge}</span>
                  ) : null}
                </button>
              ))}
            </nav>
          </aside>

          <section>
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Stat label={t("total_users")} value={stats.users.toLocaleString()} icon={<Users className="size-5" />} />
                  <Stat label={t("total_orders")} value={String(stats.orders)} icon={<ShoppingBag className="size-5" />} />
                  <Stat label={t("total_series")} value={String(stats.seriesCount)} icon={<Film className="size-5" />} />
                  <Stat label={t("revenue")} value={formatYER(stats.revenue, lang)} icon={<BarChart3 className="size-5" />} highlight />
                </div>
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-4">{lang === "ar" ? "نمو الطلبات (آخر 7 أيام)" : "Orders growth (last 7 days)"}</h3>
                  <Last7Chart />
                </div>
              </div>
            )}
            {tab === "series" && <SeriesManager />}
            {tab === "offers" && <OffersManager />}
            {tab === "orders" && <OrdersManager />}
            {tab === "payments" && <PaymentsManager />}
            {tab === "requests" && <RequestsManager />}
            {tab === "slides" && <SlidesManager />}
            {tab === "settings" && <SettingsManager />}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Last7Chart() {
  const { orders } = useStore();
  const days = useMemo(() => {
    const arr = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return { ts: d.getTime(), count: 0 };
    });
    orders.forEach((o) => {
      const day = new Date(o.createdAt);
      day.setHours(0, 0, 0, 0);
      const slot = arr.find((d) => d.ts === day.getTime());
      if (slot) slot.count++;
    });
    return arr;
  }, [orders]);
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="flex items-end gap-2 h-40">
      {days.map((d) => (
        <div key={d.ts} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md gradient-red opacity-90 hover:opacity-100 transition" style={{ height: `${(d.count / max) * 100}%`, minHeight: 4 }} />
          <span className="text-[10px] text-muted-foreground">{new Date(d.ts).toLocaleDateString(undefined, { weekday: "short" })}</span>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn("glass rounded-2xl p-5", highlight && "ring-2 ring-primary/40")}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs">{label}</span>
        <span className="grid size-9 place-items-center rounded-full gradient-red text-primary-foreground">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}
