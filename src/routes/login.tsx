import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { t, lang } = useI18n();
  const { login } = useStore();
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const next = sp.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email);
    nav(next);
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-24 md:pb-12 mx-auto max-w-md px-4">
        <div className="glass rounded-2xl p-8 mt-10">
          <h1 className="font-display text-4xl text-center">{t("nav_login")}</h1>
          <p className="text-center text-muted-foreground mt-2 text-sm">{lang === "ar" ? "ادخل بريدك للمتابعة" : "Sign in to continue"}</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label={t("email")} type="email" value={email} onChange={setEmail} required />
            <Field label={t("password")} type="password" value={password} onChange={setPassword} required />
            <button className="w-full rounded-md gradient-red py-3 font-bold shadow-glow">{t("nav_login")}</button>
            <div className="text-center text-xs text-muted-foreground">
              {t("no_account")} <Link to="/register" className="text-primary font-bold">{t("nav_register")}</Link>
            </div>
            <p className="text-center text-[10px] text-muted-foreground">
              {lang === "ar" ? "تلميح: استخدم بريداً يبدأ بـ admin@ للوصول للوحة الإدارة" : "Tip: emails starting with admin@ get admin access"}
            </p>
          </form>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

export function Field({ label, type = "text", value, onChange, required }: { label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground mb-1 block">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md bg-input px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}
