import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Heart, LogOut, Menu, Search, ShoppingCart, User as UserIcon, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, lang, toggle } = useI18n();
  const { user, cartCount, logout, settings, navLinks } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const path = useLocation().pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  const links = navLinks.length > 0
    ? [...navLinks]
        .filter((n) => n.active)
        .sort((a, b) => a.order - b.order)
        .map((n) => ({ to: n.url, label: lang === "ar" ? n.labelAr : n.labelEn, end: n.url === "/" }))
    : [
        { to: "/", label: t("nav_home"), end: true },
        { to: "/category/korean", label: t("nav_korean"), end: false },
        { to: "/category/turkish", label: t("nav_turkish"), end: false },
        { to: "/category/english", label: t("nav_english"), end: false },
        { to: "/category/trending", label: t("nav_trending"), end: false },
        { to: "/category/new", label: t("nav_new"), end: false },
      ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all",
        scrolled || open ? "bg-background/95 backdrop-blur shadow-card" : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 md:px-10">
        <Link to="/" className="flex items-center font-display text-2xl tracking-wider text-primary leading-none">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.logoText}
              className={cn(
                "w-auto object-contain block",
                settings.logoSize === "sm" && "h-20",
                settings.logoSize === "md" && "h-28",
                settings.logoSize === "lg" && "h-36",
                settings.logoSize === "xl" && "h-44",
              )}
            />
          ) : (
            <span>{settings.logoText}</span>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn("transition", isActive ? "text-white font-bold" : "text-white/80 hover:text-white")
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submitSearch} className="hidden md:flex ms-auto items-center gap-2 rounded-full glass px-3 py-1.5 w-64">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>

        <div className="ms-auto md:ms-0 flex items-center gap-1 md:gap-2">
          <button
            onClick={toggle}
            className="hidden md:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold hover:bg-white/10 transition"
            aria-label="language"
          >
            <Globe className="size-4" />
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <Link to="/favorites" aria-label={t("nav_favorites")} className="grid size-10 place-items-center rounded-full hover:bg-white/10 transition">
            <Heart className="size-5" />
          </Link>
          <Link to="/cart" aria-label={t("nav_cart")} className="relative grid size-10 place-items-center rounded-full hover:bg-white/10 transition">
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile" className="grid size-10 place-items-center rounded-full hover:bg-white/10 transition">
                <UserIcon className="size-5" />
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="rounded-md bg-primary/20 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/30 transition">
                  {t("nav_admin")}
                </Link>
              )}
              <button onClick={logout} aria-label={t("nav_logout")} className="grid size-10 place-items-center rounded-full hover:bg-white/10 transition">
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden md:inline-flex rounded-md gradient-red px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90 transition">
              {t("nav_login")}
            </Link>
          )}

          <button onClick={() => setOpen((o) => !o)} className="lg:hidden grid size-10 place-items-center rounded-full hover:bg-white/10">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur">
          <div className="px-4 py-4 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="md:hidden flex items-center gap-2 rounded-full glass px-3 py-2 mb-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full bg-transparent text-sm outline-none"
              />
            </form>
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-md px-3 py-2 text-sm hover:bg-white/5">{l.label}</Link>
            ))}
            <button onClick={toggle} className="text-start rounded-md px-3 py-2 text-sm hover:bg-white/5">
              {lang === "ar" ? "English" : "العربية"}
            </button>
            {user ? (
              <>
                <Link to="/profile" className="rounded-md px-3 py-2 text-sm hover:bg-white/5">{t("nav_profile")}</Link>
                {user.isAdmin && <Link to="/admin" className="rounded-md px-3 py-2 text-sm text-primary hover:bg-white/5">{t("nav_admin")}</Link>}
                <button onClick={logout} className="text-start rounded-md px-3 py-2 text-sm hover:bg-white/5">{t("nav_logout")}</button>
              </>
            ) : (
              <Link to="/login" className="rounded-md gradient-red px-3 py-2 text-center text-sm font-bold mt-2">{t("nav_login")}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const { t } = useI18n();
  const { settings } = useStore();
  return (
    <footer className="mt-20 border-t border-border bg-background/80">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-4 md:px-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center font-display text-2xl text-primary leading-none">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.logoText}
                className={cn(
                  "w-auto object-contain block",
                  settings.logoSize === "sm" && "h-20",
                  settings.logoSize === "md" && "h-28",
                  settings.logoSize === "lg" && "h-36",
                  settings.logoSize === "xl" && "h-44",
                )}
              />
            ) : (
              <span>{settings.logoText}</span>
            )}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t("footer_about")}</p>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t("nav_home")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/category/korean" className="hover:text-primary">{t("nav_korean")}</Link></li>
            <li><Link to="/category/turkish" className="hover:text-primary">{t("nav_turkish")}</Link></li>
            <li><Link to="/category/english" className="hover:text-primary">{t("nav_english")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t("nav_profile")}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/profile" className="hover:text-primary">{t("nav_orders")}</Link></li>
            <li><Link to="/favorites" className="hover:text-primary">{t("nav_favorites")}</Link></li>
            <li><Link to="/requests" className="hover:text-primary">{t("nav_requests")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-3">© Movana</h4>
          <p className="text-sm text-muted-foreground">YER · YE · 2026</p>
        </div>
      </div>
    </footer>
  );
}

export function MobileBottomNav() {
  const { t } = useI18n();
  const { cartCount } = useStore();
  const items = [
    { to: "/", icon: <Menu className="size-5" />, label: t("nav_home"), end: true },
    { to: "/search", icon: <Search className="size-5" />, label: t("nav_search") },
    { to: "/favorites", icon: <Heart className="size-5" />, label: t("nav_favorites") },
    { to: "/cart", icon: <ShoppingCart className="size-5" />, label: t("nav_cart"), badge: cartCount },
    { to: "/profile", icon: <UserIcon className="size-5" />, label: t("nav_profile") },
  ];
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 glass border-t border-border">
      <div className="grid grid-cols-5">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              cn("relative flex flex-col items-center gap-1 py-2 text-[10px]", isActive ? "text-primary" : "text-muted-foreground")
            }
          >
            {it.icon}
            <span>{it.label}</span>
            {it.badge ? (
              <span className="absolute top-1 end-1/4 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{it.badge}</span>
            ) : null}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
