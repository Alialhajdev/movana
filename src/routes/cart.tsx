import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function CartPage() {
  const { t, lang } = useI18n();
  const { cart, setQty, removeFromCart, cartTotal, findSeries, user } = useStore();
  const nav = useNavigate();
  useEffect(() => { if (!user) nav("/login?next=/cart"); }, [user, nav]);
  if (!user) return null;

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-5xl px-4 md:px-10">
        <Steps active={0} />
        <h1 className="font-display text-4xl mb-6 mt-8">{t("nav_cart")}</h1>

        {cart.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-muted-foreground mb-6">{t("cart_empty")}</p>
            <Link to="/" className="inline-block rounded-md gradient-red px-5 py-2.5 text-sm font-bold">{t("continue_shopping")}</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-3">
              {cart.map((it) => {
                const s = findSeries(it.seriesId);
                if (!s) return null;
                return (
                  <div key={it.seriesId} className="glass rounded-xl p-3 flex items-center gap-4">
                    <div className={`h-24 w-16 shrink-0 rounded-md bg-gradient-to-br ${s.posterColor}`} />
                    <div className="flex-1 min-w-0">
                      <Link to={`/series/${s.id}`} className="font-bold hover:text-primary line-clamp-1">{s.title[lang]}</Link>
                      <p className="text-xs text-muted-foreground">{s.year} · {s.seasons} {t("seasons")}</p>
                      <p className="mt-1 text-primary font-bold">{formatYER(s.price, lang)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setQty(it.seriesId, it.qty - 1)} className="grid size-8 place-items-center rounded-md bg-input hover:bg-primary"><Minus className="size-4" /></button>
                      <span className="w-6 text-center">{it.qty}</span>
                      <button onClick={() => setQty(it.seriesId, it.qty + 1)} className="grid size-8 place-items-center rounded-md bg-input hover:bg-primary"><Plus className="size-4" /></button>
                    </div>
                    <button onClick={() => removeFromCart(it.seriesId)} aria-label={t("cart_remove")} className="grid size-9 place-items-center rounded-md hover:bg-destructive/20 text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <aside className="glass rounded-2xl p-5 h-fit sticky top-24">
              <h3 className="font-bold mb-4">{t("cart_subtotal")}</h3>
              <div className="flex justify-between text-sm text-muted-foreground"><span>{t("cart_subtotal")}</span><span>{formatYER(cartTotal, lang)}</span></div>
              <div className="my-4 border-t border-border" />
              <div className="flex justify-between text-lg font-bold"><span>{t("cart_total")}</span><span className="text-primary">{formatYER(cartTotal, lang)}</span></div>
              <Link to="/checkout" className="mt-5 block text-center rounded-md gradient-red px-4 py-3 text-sm font-bold shadow-glow">{t("cart_checkout")}</Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export function Steps({ active }: { active: 0 | 1 | 2 }) {
  const { t } = useI18n();
  const labels = [t("step_cart"), t("step_payment"), t("step_confirm")];
  return (
    <ol className="flex items-center gap-2 text-xs">
      {labels.map((l, i) => (
        <li key={l} className="flex items-center gap-2">
          <span className={`grid size-7 place-items-center rounded-full font-bold ${i <= active ? "gradient-red text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
          <span className={i <= active ? "text-white" : "text-muted-foreground"}>{l}</span>
          {i < labels.length - 1 && <span className="mx-1 h-px w-8 bg-border" />}
        </li>
      ))}
    </ol>
  );
}
