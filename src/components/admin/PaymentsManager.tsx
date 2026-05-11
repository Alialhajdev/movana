import { CheckCircle, XCircle } from "lucide-react";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export function PaymentsManager() {
  const { t, lang } = useI18n();
  const { orders, updateOrderStatus } = useStore();
  const list = orders.filter((o) => o.paymentMethod === "wallet_transfer" && o.status === "pending");

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="font-bold mb-4">{t("admin_payments")}</h3>
      {list.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا توجد إيصالات قيد المراجعة." : "No payment receipts pending review."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3">#</th>
                <th className="text-start p-3">{t("customer")}</th>
                <th className="text-start p-3">{t("receipt")}</th>
                <th className="text-start p-3">{t("cart_total")}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{o.id}</td>
                  <td className="p-3 text-xs">
                    <div>{o.customerName || "—"}</div>
                    <div className="text-muted-foreground">{o.customerEmail || "—"}</div>
                  </td>
                  <td className="p-3 text-xs">{o.receiptName || "—"}</td>
                  <td className="p-3 text-primary font-bold">{formatYER(o.total, lang)}</td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => updateOrderStatus(o.id, "delivered")} className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1.5 text-xs"><CheckCircle className="size-4" /> {t("approve")}</button>
                      <button onClick={() => updateOrderStatus(o.id, "rejected")} className="inline-flex items-center gap-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30 px-3 py-1.5 text-xs"><XCircle className="size-4" /> {t("reject")}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
