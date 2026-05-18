import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload, Wallet, Truck } from "lucide-react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Steps } from "./cart";
import { AddressManager } from "@/components/AddressManager";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore, type Order, type Address } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { t, lang } = useI18n();
  const { cart, cartTotal, user, placeOrder, findSeries, addresses, wallets } = useStore();
  const nav = useNavigate();
  const [method, setMethod] = useState<Order["paymentMethod"]>("wallet");
  const [receipt, setReceipt] = useState<string>();
  const [selected, setSelected] = useState<Address | null>(null);

  useEffect(() => {
    if (!user) nav("/login?next=/checkout");
  }, [user, nav]);

  useEffect(() => {
    if (!selected && addresses.length > 0) setSelected(addresses[0]);
  }, [addresses, selected]);

  if (!user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error(t("cart_empty"));
      return;
    }
    if (!selected) {
      toast.error(t("select_address"));
      return;
    }
    const order = await placeOrder(method, receipt, selected);
    if (!order) { toast.error(lang === "ar" ? "فشل إنشاء الطلب" : "Failed to place order"); return; }
    nav(`/order-confirm/${order.id}`);
  };

  const methods = [
    { id: "wallet" as const, label: t("pay_wallet"), icon: <Wallet className="size-5" /> },
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
            <AddressManager selectedId={selected?.id} onSelect={setSelected} />

            <div className="glass rounded-2xl p-5">
              <h3 className="font-bold mb-4">{t("pay_method")}</h3>
              <div className="grid sm:grid-cols-2 gap-3">{methods.map((m) => (
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
                {wallets.filter((w) => w.active).length === 0 ? (
                  <div className="rounded-lg bg-input p-4 text-sm text-muted-foreground">
                    {lang === "ar" ? "لا توجد محافظ متاحة حالياً." : "No wallets available."}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {wallets.filter((w) => w.active).map((w) => (
                      <div key={w.id} className="rounded-lg bg-input p-4 flex items-center gap-3">
                        <div className="text-3xl">{w.icon || "💳"}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-muted-foreground">{w.name}</div>
                          <div className="font-mono text-base tracking-wider truncate">{w.number}</div>
                        </div>
                        <button type="button" onClick={() => { navigator.clipboard?.writeText(w.number); toast.success(lang === "ar" ? "تم النسخ" : "Copied"); }} className="rounded-md bg-secondary hover:bg-white/10 px-3 py-1.5 text-xs">
                          {lang === "ar" ? "نسخ" : "Copy"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  {lang === "ar" ? "حول المبلغ إلى إحدى المحافظ أعلاه ثم ارفع لقطة شاشة لإيصال التحويل." : "Transfer the amount to one of the wallets above and upload a screenshot of the receipt."}
                </p>
                <label className="flex items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 cursor-pointer hover:border-primary transition">
                  <Upload className="size-5 text-primary" />
                  <span className="text-sm">{receipt ?? t("pay_upload")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0]?.name)} />
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
            {selected && (
              <div className="rounded-lg bg-input/60 p-3 text-xs space-y-1">
                <div className="font-bold">{t("address")}: {selected.label}</div>
                <div className="text-muted-foreground">{selected.fullName} · {selected.phone}</div>
                <div className="text-muted-foreground line-clamp-2">
                  {selected.city}{selected.district ? ` - ${selected.district}` : ""}
                </div>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
              <span>{t("cart_total")}</span>
              <span className="text-primary">{formatYER(cartTotal, lang)}</span>
            </div>
            <button type="submit" className="w-full rounded-md gradient-red px-4 py-3 text-sm font-bold shadow-glow">{t("step_confirm")}</button>
          </aside>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
