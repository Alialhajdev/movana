import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Field } from "./login";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const { t, lang } = useI18n();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const list = JSON.parse(localStorage.getItem("movana_requests") || "[]");
    list.unshift({ id: Date.now(), title, details, status: "open", createdAt: Date.now() });
    localStorage.setItem("movana_requests", JSON.stringify(list));
    setTitle(""); setDetails("");
    toast.success(lang === "ar" ? "تم إرسال طلبك" : "Request submitted");
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-2xl px-4 md:px-10">
        <h1 className="font-display text-4xl">{t("request_title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("request_desc")}</p>
        <form onSubmit={submit} className="mt-8 glass rounded-2xl p-6 space-y-4">
          <Field label={lang === "ar" ? "اسم المسلسل" : "Series name"} value={title} onChange={setTitle} required />
          <label className="block">
            <span className="text-xs text-muted-foreground mb-1 block">{lang === "ar" ? "تفاصيل إضافية" : "Additional details"}</span>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              className="w-full rounded-md bg-input px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </label>
          <button className="w-full rounded-md gradient-red py-3 font-bold shadow-glow">{t("send")}</button>
        </form>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
