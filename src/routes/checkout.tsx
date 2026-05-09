import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, Wallet, Truck, CreditCard } from "lucide-react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Steps } from "./cart";
import { findSeries } from "@/lib/data";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { t, lang } = useI18n();
  const { cart, cartTotal, user, placeOrder } = useStore();
  const nav = useNavigate();
  const [method, setMethod] = useState<Order["paymentMethod"]>("wallet_transfer");
  const [receipt, setReceipt] = useState<string>();

  if (!user) {
    if (typeof window !== "undefined") nav({ to: "/login", search: { next: "/checkout" } });
    return null;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error(t("cart_empty"));
      return;
    }
    const order = placeOrder(method, receipt);
    nav({ to: "/order-confirm/$id", params: { id: order.id } });
  };

  const methods = [
    { id: "wallet_transfer" as const, label: t("pay_wallet_transfer"), icon: <Wallet className="size-5" /> },
    { id: "wallet" as const, label: t("pay_wallet"), icon: <CreditCard className="size-5" /> },
    { id: "cod" as const, label: t("pay_cod"), icon: <Truck className="size-5" /> },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-5xl px-4 md:px-10">
        <Steps active={1} />
        <h1 className="font-display text-4xl mb-6 mt-8">{t("step_payment")}</h1>

        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold mb-4">{t("pay_method")}</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {methods.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition",
                      method === m.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <input type="radio" className="sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
                    {m.icon}
                    <span className="text-sm text-center">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {(method === "wallet_transfer" || method === "wallet") && (
              <div className="glass rounded-2xl p-5 space-y-4">
                <h3 className="font-bold">{t("pay_account")}</h3>
                <div className="rounded-lg bg-input p-4 font-mono text-lg tracking-wider">
                  Movana Wallet · 0773 123 456
                </div>
                <p className="text-xs text-muted-foreground">
                  {lang === "ar"
                    ? "حول المبلغ إلى الرقم أعلاه ثم ارفع لقطة شاشة لإيصال التحويل."
                    : "Transfer the amount to the number above and upload a screenshot of the receipt."}
                </p>
                <label className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 cursor-pointer hover:border-primary transition">
                  <Upload className="size-5 text-primary" />
                  <span className="text-sm">{receipt ?? t("pay_upload")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setReceipt(e.target.files?.[0]?.name)}
                  />
                </label>
              </div>
            )}
          </div>

          <aside className="glass rounded-2xl p-5 h-fit sticky top-24 space-y-3">
            <h3 className="font-bold">{t("cart_total")}</h3>
            {cart.map((it) => {
              const s = findSeries(it.seriesId);
              if (!s) return null;
              return (
                <div key={it.seriesId} className="flex justify-between text-sm">
                  <span className="line-clamp-1">{s.title[lang]} × {it.qty}</span>
                  <span>{formatYER(s.price * it.qty, lang)}</span>
                </div>
              );
            })}
            <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
              <span>{t("cart_total")}</span>
              <span className="text-primary">{formatYER(cartTotal, lang)}</span>
            </div>
            <button type="submit" className="w-full rounded-md gradient-red px-4 py-3 text-sm font-bold shadow-glow">
              {t("step_confirm")}
            </button>
          </aside>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
