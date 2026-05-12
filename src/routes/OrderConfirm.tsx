import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Steps } from "./cart";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function OrderConfirm() {
  const { id = "" } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-3xl px-4 md:px-10">
        <Steps active={2} />
        <div className="mt-10 glass rounded-2xl p-10 text-center animate-fade-up">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-primary/15 text-primary mb-4">
            <CheckCircle2 className="size-12" />
          </div>
          <h1 className="font-display text-4xl">{t("order_placed")}</h1>
          <p className="mt-3 text-muted-foreground">{t("order_placed_desc")}</p>
          {order && (
            <div className="mt-6 inline-flex flex-col gap-1 rounded-xl bg-input px-6 py-4">
              <span className="text-xs text-muted-foreground">#{order.id}</span>
              <span className="text-xl font-bold text-primary">{formatYER(order.total, lang)}</span>
              <span className="text-xs">{t("pay_status")}: <span className="text-[var(--gold)]">{t("status_pending")}</span></span>
            </div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/profile" className="rounded-md gradient-red px-5 py-2.5 text-sm font-bold">{t("view_orders")}</Link>
            <Link to="/" className="rounded-md glass px-5 py-2.5 text-sm font-bold hover:bg-white/10">{t("go_home")}</Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
