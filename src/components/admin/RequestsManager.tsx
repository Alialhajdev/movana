import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function RequestsManager() {
  const { t, lang } = useI18n();
  const { requests, updateRequestStatus, deleteRequest } = useStore();

  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="font-bold mb-4">{t("admin_requests")}</h3>
      {requests.length === 0 ? (
        <p className="p-10 text-center text-muted-foreground">{lang === "ar" ? "لا توجد طلبات." : "No requests."}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase">
              <tr>
                <th className="text-start p-3">{lang === "ar" ? "العنوان" : "Title"}</th>
                <th className="text-start p-3">{lang === "ar" ? "التفاصيل" : "Details"}</th>
                <th className="text-start p-3">{lang === "ar" ? "المستخدم" : "User"}</th>
                <th className="text-start p-3">{t("request_status")}</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="p-3 font-medium">{r.title}</td>
                  <td className="p-3 text-xs text-muted-foreground max-w-md">{r.details || "—"}</td>
                  <td className="p-3 text-xs">{r.userEmail || "—"}</td>
                  <td className="p-3">
                    <span className={cn(
                      "rounded-full px-2 py-1 text-xs font-bold",
                      r.status === "approved" && "bg-emerald-500/15 text-emerald-400",
                      r.status === "rejected" && "bg-destructive/15 text-destructive",
                      r.status === "open" && "bg-[var(--gold)]/15 text-[var(--gold)]"
                    )}>{t(`status_${r.status}` as "status_open")}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => updateRequestStatus(r.id, "approved")} className="grid size-8 place-items-center rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30" title={t("approve")}><CheckCircle className="size-4" /></button>
                      <button onClick={() => updateRequestStatus(r.id, "rejected")} className="grid size-8 place-items-center rounded-md bg-destructive/15 text-destructive hover:bg-destructive/30" title={t("reject")}><XCircle className="size-4" /></button>
                      <button onClick={() => { if (confirm(t("confirm_delete"))) deleteRequest(r.id); }} className="grid size-8 place-items-center rounded-md bg-white/5 hover:bg-white/10" title={t("delete")}><Trash2 className="size-4" /></button>
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
