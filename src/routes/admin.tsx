import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Film, ImageIcon, MessageSquare, ShoppingBag, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { Header, Footer } from "@/components/Layout";
import { findSeries, series as allSeries } from "@/lib/data";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Tab = "dashboard" | "series" | "orders" | "payments" | "requests" | "slides";

function AdminPage() {
  const { t, lang } = useI18n();
  const { user, orders } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined" && (!user || !user.isAdmin)) {
      nav({ to: "/login", search: { next: "/admin" } });
    }
  }, [user, nav]);

  // Combine current user orders with any persisted orders for demo
  useEffect(() => setAllOrders(orders), [orders]);

  const stats = useMemo(() => {
    const revenue = allOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
    return {
      users: 1248,
      orders: allOrders.length,
      seriesCount: allSeries.length,
      revenue,
    };
  }, [allOrders]);

  if (!user || !user.isAdmin) return null;

  const updateStatus = (id: string, status: Order["status"]) => {
    const next = allOrders.map((o) => (o.id === id ? { ...o, status } : o));
    setAllOrders(next);
    localStorage.setItem("movana_orders", JSON.stringify(next));
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: t("admin_dashboard"), icon: <BarChart3 className="size-4" /> },
    { id: "series", label: t("admin_series"), icon: <Film className="size-4" /> },
    { id: "orders", label: t("admin_orders"), icon: <ShoppingBag className="size-4" /> },
    { id: "payments", label: t("admin_payments"), icon: <Users className="size-4" /> },
    { id: "requests", label: t("admin_requests"), icon: <MessageSquare className="size-4" /> },
    { id: "slides", label: t("admin_slides"), icon: <ImageIcon className="size-4" /> },
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
                  {tb.label}
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
                  <div className="flex items-end gap-2 h-40">
                    {[40, 65, 50, 80, 70, 95, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md gradient-red opacity-90 hover:opacity-100 transition" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="glass rounded-2xl p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-muted-foreground text-xs uppercase">
                    <tr><th className="text-start p-3">#</th><th className="text-start p-3">{lang === "ar" ? "العناصر" : "Items"}</th><th className="text-start p-3">{t("cart_total")}</th><th className="text-start p-3">{t("pay_method")}</th><th className="text-start p-3">{t("pay_status")}</th><th className="p-3" /></tr>
                  </thead>
                  <tbody>
                    {allOrders.length === 0 && (
                      <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا توجد طلبات" : "No orders"}</td></tr>
                    )}
                    {allOrders.map((o) => (
                      <tr key={o.id} className="border-t border-border">
                        <td className="p-3 font-mono text-xs">{o.id}</td>
                        <td className="p-3">{o.items.map((i) => findSeries(i.seriesId)?.title[lang]).join(", ")}</td>
                        <td className="p-3 text-primary font-bold">{formatYER(o.total, lang)}</td>
                        <td className="p-3 text-xs">{t(`pay_${o.paymentMethod === "wallet_transfer" ? "wallet_transfer" : o.paymentMethod === "cod" ? "cod" : "wallet"}` as "pay_cod")}</td>
                        <td className="p-3">
                          <span className={cn(
                            "rounded-full px-2 py-1 text-xs font-bold",
                            o.status === "delivered" && "bg-emerald-500/15 text-emerald-400",
                            o.status === "rejected" && "bg-destructive/15 text-destructive",
                            o.status === "pending" && "bg-[var(--gold)]/15 text-[var(--gold)]"
                          )}>{t(`status_${o.status}` as "status_pending")}</span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 justify-end">
                            <button onClick={() => updateStatus(o.id, "delivered")} className="grid size-8 place-items-center rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30" title="Deliver"><CheckCircle className="size-4" /></button>
                            <button onClick={() => updateStatus(o.id, "rejected")} className="grid size-8 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30" title="Reject"><XCircle className="size-4" /></button>
                            <button onClick={() => updateStatus(o.id, "pending")} className="grid size-8 place-items-center rounded-md bg-[var(--gold)]/15 text-[var(--gold)] hover:bg-[var(--gold)]/30" title="Pending"><Clock className="size-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "series" && (
              <div className="glass rounded-2xl p-4 overflow-x-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">{t("admin_series")}</h3>
                  <button className="rounded-md gradient-red px-4 py-2 text-xs font-bold">+ {lang === "ar" ? "إضافة مسلسل" : "New series"}</button>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-muted-foreground text-xs uppercase"><tr><th className="text-start p-3">{lang === "ar" ? "المسلسل" : "Title"}</th><th className="text-start p-3">{lang === "ar" ? "الفئة" : "Category"}</th><th className="text-start p-3">IMDB</th><th className="text-start p-3">{lang === "ar" ? "السعر" : "Price"}</th></tr></thead>
                  <tbody>
                    {allSeries.map((s) => (
                      <tr key={s.id} className="border-t border-border">
                        <td className="p-3">{s.title[lang]}</td>
                        <td className="p-3 text-xs text-muted-foreground">{s.category}</td>
                        <td className="p-3">{s.imdb}</td>
                        <td className="p-3 text-primary font-bold">{formatYER(s.price, lang)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "payments" && (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground">
                {lang === "ar" ? "لا توجد إيصالات قيد المراجعة حالياً." : "No payment receipts pending review."}
              </div>
            )}

            {tab === "requests" && (
              <div className="glass rounded-2xl p-6 text-center text-muted-foreground">
                {lang === "ar" ? "لا توجد طلبات مسلسلات جديدة." : "No new series requests."}
              </div>
            )}

            {tab === "slides" && (
              <div className="grid sm:grid-cols-3 gap-4">
                {allSeries.filter((s) => s.featured).map((s) => (
                  <div key={s.id} className={`glass rounded-xl overflow-hidden`}>
                    <div className={`aspect-video bg-gradient-to-br ${s.posterColor}`} />
                    <div className="p-3">
                      <p className="font-bold text-sm">{s.title[lang]}</p>
                      <p className="text-xs text-muted-foreground">{s.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
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
