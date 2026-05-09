import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { Field } from "./login";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { t } = useI18n();
  const { login } = useStore();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    login(email, name);
    nav({ to: "/" });
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
            <button className="w-full rounded-md gradient-red py-3 font-bold shadow-glow">{t("nav_register")}</button>
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
