import { useMemo, useState } from "react";
import { CheckCircle, XCircle, Clock, Trash2, Search } from "lucide-react";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore, type Order } from "@/lib/store";
import { cn } from "@/lib/utils";

export function OrdersManager() {
  const { t, lang } = useI18n();
  const { orders, updateOrderStatus, deleteOrder, findSeries } = useStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Order["status"]>("all");

  const list = useMemo(() => {
    let base = orders;
    if (status !== "all") base = base.filter((o) => o.status === status);
    if (q.trim()) {
      const n = q.toLowerCase();
      base = base.filter((o) => o.id.toLowerCase().includes(n) || (o.customerEmail || "").toLowerCase().includes(n));
    }
    return base;
  }, [orders, status, q]);

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-md bg-input px-3 py-2 flex-1 min-w-[200px]">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} className="bg-transparent outline-none flex-1 text-sm" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="rounded-md bg-input px-3 py-2 text-sm">
          <option value="all">{t("all")}</option>
          <option value="pending">{t("status_pending")}</option>
          <option value="delivered">{t("status_delivered")}</option>
          <option value="rejected">{t("status_rejected")}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-start p-3">#</th>
              <th className="text-start p-3">{t("customer")}</th>
              <th className="text-start p-3">{lang === "ar" ? "العناصر" : "Items"}</th>
              <th className="text-start p-3">{t("cart_total")}</th>
              <th className="text-start p-3">{t("pay_method")}</th>
              <th className="text-start p-3">{t("pay_status")}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">{t("no_data")}</td></tr>
            )}
            {list.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="p-3 font-mono text-xs">{o.id}</td>
                <td className="p-3 text-xs">
                  <div>{o.customerName || "—"}</div>
                  <div className="text-muted-foreground">{o.customerEmail || "—"}</div>
                </td>
                <td className="p-3 text-xs">{o.items.map((i) => findSeries(i.seriesId)?.title[lang] ?? i.seriesId).join(", ")}</td>
                <td className="p-3 text-primary font-bold">{formatYER(o.total, lang)}</td>
                <td className="p-3 text-xs">
                  {o.paymentMethod === "wallet_transfer" ? t("pay_wallet_transfer") : o.paymentMethod === "cod" ? t("pay_cod") : t("pay_wallet")}
                  {o.receiptName && <div className="text-muted-foreground mt-1">📎 {o.receiptName}</div>}
                </td>
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
                    <button onClick={() => updateOrderStatus(o.id, "delivered")} className="grid size-8 place-items-center rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30" title={t("status_delivered")}><CheckCircle className="size-4" /></button>
                    <button onClick={() => updateOrderStatus(o.id, "rejected")} className="grid size-8 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30" title={t("status_rejected")}><XCircle className="size-4" /></button>
                    <button onClick={() => updateOrderStatus(o.id, "pending")} className="grid size-8 place-items-center rounded-md bg-[var(--gold)]/15 text-[var(--gold)] hover:bg-[var(--gold)]/30" title={t("status_pending")}><Clock className="size-4" /></button>
                    <button onClick={() => { if (confirm(t("confirm_delete"))) deleteOrder(o.id); }} className="grid size-8 place-items-center rounded-md bg-white/5 hover:bg-white/10" title={t("delete")}><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
