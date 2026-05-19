import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Field } from "./login";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export default function RegisterPage() {
  const { t, lang } = useI18n();
  const { signUp } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setBusy(true);
    const { error } = await signUp(email, password, name, phone);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(lang === "ar" ? "تم إنشاء الحساب" : "Account created");
    nav("/");
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-md px-4">
        <div className="glass rounded-2xl p-8 mt-10">
          <h1 className="font-display text-4xl text-center">{t("nav_register")}</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label={t("full_name")} value={name} onChange={setName} required />
            <Field label={t("email")} type="email" value={email} onChange={setEmail} required />
            <Field label={t("phone")} value={phone} onChange={setPhone} />
            <Field label={t("password")} type="password" value={password} onChange={setPassword} required />
            <button disabled={busy} className="w-full rounded-md gradient-red py-3 font-bold shadow-glow disabled:opacity-60">
              {busy ? "…" : t("nav_register")}
            </button>
            <div className="text-center text-xs text-muted-foreground">
              {t("have_account")} <Link to="/login" className="text-primary font-bold">{t("nav_login")}</Link>
            </div>
          </form>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
