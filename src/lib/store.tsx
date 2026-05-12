import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { series as seedSeries, type Series, type Category } from "./data";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface CartItem {
  seriesId: string;
  qty: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  district?: string;
  street?: string;
  details?: string;
  mapUrl?: string;
  lat?: number;
  lng?: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: "wallet_transfer" | "cod" | "wallet";
  status: "pending" | "delivered" | "rejected";
  createdAt: number;
  receiptName?: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  address?: Address;
}

export interface SeriesRequest {
  id: string;
  title: string;
  details: string;
  status: "open" | "approved" | "rejected";
  createdAt: number;
  userEmail?: string;
}

export interface Offer {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr?: string;
  badgeEn?: string;
  discountPct?: number;
  gradient: string;
  ctaUrl?: string;
  seriesId?: string;
  active: boolean;
  expiresAt?: number;
  order: number;
}

export interface Slide {
  id: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  gradient: string;
  image?: string;
  seriesId?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
}

export type ThemePreset = "red" | "gold" | "blue" | "emerald" | "violet" | "rose";
export type ThemeMode = "dark" | "light";

export interface Settings {
  logoText: string;
  logoUrl?: string;
  themePreset: ThemePreset;
  themeMode: ThemeMode;
}

interface Store {
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  orders: Order[];
  placeOrder: (paymentMethod: Order["paymentMethod"], receiptName?: string, address?: Address) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
  series: Series[];
  findSeries: (id: string) => Series | undefined;
  byCategory: (c: Category) => Series[];
  addSeries: (s: Series) => void;
  updateSeries: (id: string, patch: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
  requests: SeriesRequest[];
  submitRequest: (r: Omit<SeriesRequest, "id" | "createdAt" | "status">) => void;
  updateRequestStatus: (id: string, status: SeriesRequest["status"]) => void;
  deleteRequest: (id: string) => void;
  slides: Slide[];
  addSlide: (s: Omit<Slide, "id" | "order">) => void;
  updateSlide: (id: string, patch: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (id: string, dir: -1 | 1) => void;
  offers: Offer[];
  addOffer: (o: Omit<Offer, "id" | "order">) => void;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  reorderOffer: (id: string, dir: -1 | 1) => void;
  // addresses
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Address;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  // settings
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
}

const Ctx = createContext<Store | null>(null);

const read = <T,>(k: string, fb: T): T => {
  if (typeof window === "undefined") return fb;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fb;
  } catch {
    return fb;
  }
};

const defaultSlides = (): Slide[] =>
  seedSeries.filter((s) => s.featured).slice(0, 3).map((s, i) => ({
    id: `slide-${s.id}`,
    titleAr: s.title.ar,
    titleEn: s.title.en,
    subtitleAr: s.description.ar,
    subtitleEn: s.description.en,
    gradient: s.posterColor,
    seriesId: s.id,
    active: true,
    order: i,
  }));

const defaultOffers = (): Offer[] => [
  {
    id: "offer-1",
    titleAr: "عرض الافتتاح",
    titleEn: "Launch Special",
    descriptionAr: "خصم 30% على جميع المسلسلات الكورية لفترة محدودة. استمتع بأفضل الإنتاجات الكورية بأسعار لا تقاوم.",
    descriptionEn: "30% off all Korean series for a limited time. Enjoy top Korean productions at unbeatable prices.",
    badgeAr: "الأكثر طلباً",
    badgeEn: "Most popular",
    discountPct: 30,
    gradient: "from-rose-700 via-red-900 to-zinc-950",
    ctaUrl: "/category/korean",
    active: true,
    order: 0,
  },
  {
    id: "offer-2",
    titleAr: "باقة العائلة",
    titleEn: "Family Bundle",
    descriptionAr: "اطلب 3 مسلسلات بسعر اثنين فقط. مثالية للسهرات العائلية.",
    descriptionEn: "Get 3 series for the price of 2. Perfect for family nights.",
    badgeAr: "وفر أكثر",
    badgeEn: "Save more",
    discountPct: 33,
    gradient: "from-amber-700 via-rose-900 to-zinc-950",
    ctaUrl: "/category/turkish",
    active: true,
    order: 1,
  },
  {
    id: "offer-3",
    titleAr: "تخفيضات نهاية الأسبوع",
    titleEn: "Weekend Deals",
    descriptionAr: "خصم 20% على المسلسلات الأجنبية حتى الأحد فقط.",
    descriptionEn: "20% off international series until Sunday only.",
    badgeAr: "وقت محدود",
    badgeEn: "Limited time",
    discountPct: 20,
    gradient: "from-violet-700 via-fuchsia-900 to-zinc-950",
    ctaUrl: "/category/english",
    active: true,
    order: 2,
  },
];

const defaultSettings = (): Settings => ({
  logoText: "MOVANA",
  logoUrl: undefined,
  themePreset: "red",
  themeMode: "dark",
});

// Theme presets — primary + accent + ring colors in oklch
const PRESETS: Record<ThemePreset, { primary: string; accent: string; ring: string; gradFrom: string; gradTo: string }> = {
  red:     { primary: "oklch(0.58 0.24 25)",  accent: "oklch(0.65 0.22 28)",  ring: "oklch(0.58 0.24 25)",  gradFrom: "oklch(0.58 0.24 25)",  gradTo: "oklch(0.45 0.22 22)" },
  gold:    { primary: "oklch(0.78 0.16 85)",  accent: "oklch(0.82 0.15 85)",  ring: "oklch(0.78 0.16 85)",  gradFrom: "oklch(0.78 0.16 85)",  gradTo: "oklch(0.6 0.16 70)" },
  blue:    { primary: "oklch(0.6 0.2 250)",   accent: "oklch(0.66 0.18 245)", ring: "oklch(0.6 0.2 250)",   gradFrom: "oklch(0.6 0.2 250)",   gradTo: "oklch(0.45 0.2 255)" },
  emerald: { primary: "oklch(0.62 0.18 155)", accent: "oklch(0.68 0.16 158)", ring: "oklch(0.62 0.18 155)", gradFrom: "oklch(0.62 0.18 155)", gradTo: "oklch(0.45 0.18 158)" },
  violet:  { primary: "oklch(0.58 0.22 295)", accent: "oklch(0.65 0.2 295)",  ring: "oklch(0.58 0.22 295)", gradFrom: "oklch(0.58 0.22 295)", gradTo: "oklch(0.42 0.22 290)" },
  rose:    { primary: "oklch(0.65 0.22 5)",   accent: "oklch(0.7 0.2 8)",     ring: "oklch(0.65 0.22 5)",   gradFrom: "oklch(0.65 0.22 5)",   gradTo: "oklch(0.5 0.22 5)" },
};

const MODES = {
  dark: {
    background: "oklch(0.13 0.015 20)",
    foreground: "oklch(0.98 0.005 0)",
    card: "oklch(0.17 0.018 20)",
    muted: "oklch(0.22 0.015 20)",
    mutedFg: "oklch(0.7 0.01 20)",
    border: "oklch(0.27 0.02 20 / 60%)",
    input: "oklch(0.25 0.02 20)",
    secondary: "oklch(0.22 0.02 20)",
  },
  light: {
    background: "oklch(0.98 0.005 20)",
    foreground: "oklch(0.18 0.015 20)",
    card: "oklch(1 0 0)",
    muted: "oklch(0.95 0.01 20)",
    mutedFg: "oklch(0.45 0.01 20)",
    border: "oklch(0.85 0.01 20 / 80%)",
    input: "oklch(0.94 0.01 20)",
    secondary: "oklch(0.94 0.01 20)",
  },
};

function applyTheme(s: Settings) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const p = PRESETS[s.themePreset];
  const m = MODES[s.themeMode];
  r.style.setProperty("--primary", p.primary);
  r.style.setProperty("--accent", p.accent);
  r.style.setProperty("--ring", p.ring);
  r.style.setProperty("--destructive", p.primary);
  r.style.setProperty("--gradient-red", `linear-gradient(135deg, ${p.gradFrom}, ${p.gradTo})`);
  r.style.setProperty("--shadow-glow", `0 0 60px -10px ${p.primary.replace(")", " / 0.55)")}`);
  r.style.setProperty("--background", m.background);
  r.style.setProperty("--foreground", m.foreground);
  r.style.setProperty("--card", m.card);
  r.style.setProperty("--card-foreground", m.foreground);
  r.style.setProperty("--popover", m.card);
  r.style.setProperty("--popover-foreground", m.foreground);
  r.style.setProperty("--muted", m.muted);
  r.style.setProperty("--muted-foreground", m.mutedFg);
  r.style.setProperty("--border", m.border);
  r.style.setProperty("--input", m.input);
  r.style.setProperty("--secondary", m.secondary);
  r.style.setProperty("--secondary-foreground", m.foreground);
  if (s.themeMode === "light") r.classList.remove("dark");
  else r.classList.add("dark");
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [series, setSeries] = useState<Series[]>(seedSeries);
  const [requests, setRequests] = useState<SeriesRequest[]>([]);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides());
  const [offers, setOffers] = useState<Offer[]>(defaultOffers());
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(read<User | null>("movana_user", null));
    setCart(read<CartItem[]>("movana_cart", []));
    setFavorites(read<string[]>("movana_fav", []));
    setOrders(read<Order[]>("movana_orders", []));
    setSeries(read<Series[]>("movana_series", seedSeries));
    setRequests(read<SeriesRequest[]>("movana_requests", []));
    setSlides(read<Slide[]>("movana_slides", defaultSlides()));
    setOffers(read<Offer[]>("movana_offers", defaultOffers()));
    setAddresses(read<Address[]>("movana_addresses", []));
    const st = read<Settings>("movana_settings", defaultSettings());
    setSettings(st);
    applyTheme(st);
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("movana_user", JSON.stringify(user)); }, [user, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_fav", JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_series", JSON.stringify(series)); }, [series, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_requests", JSON.stringify(requests)); }, [requests, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_slides", JSON.stringify(slides)); }, [slides, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_offers", JSON.stringify(offers)); }, [offers, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_addresses", JSON.stringify(addresses)); }, [addresses, hydrated]);
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("movana_settings", JSON.stringify(settings));
      applyTheme(settings);
    }
  }, [settings, hydrated]);

  const findSeries = (id: string) => series.find((s) => s.id === id);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (findSeries(i.seriesId)?.price ?? 0) * i.qty, 0),
    [cart, series] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const value: Store = {
    user,
    login: (email, name) =>
      setUser({
        id: email,
        email,
        name: name ?? email.split("@")[0],
        isAdmin: email.toLowerCase().startsWith("admin"),
      }),
    logout: () => setUser(null),
    cart,
    addToCart: (id, qty = 1) =>
      setCart((c) => {
        const existing = c.find((i) => i.seriesId === id);
        if (existing) return c.map((i) => (i.seriesId === id ? { ...i, qty: i.qty + qty } : i));
        return [...c, { seriesId: id, qty }];
      }),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.seriesId !== id)),
    setQty: (id, qty) =>
      setCart((c) => c.map((i) => (i.seriesId === id ? { ...i, qty: Math.max(1, qty) } : i))),
    clearCart: () => setCart([]),
    cartTotal,
    cartCount,
    favorites,
    toggleFavorite: (id) =>
      setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id])),
    isFavorite: (id) => favorites.includes(id),
    orders,
    placeOrder: (paymentMethod, receiptName, address) => {
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        items: cart,
        total: cartTotal,
        paymentMethod,
        status: "pending",
        createdAt: Date.now(),
        receiptName,
        customerEmail: user?.email,
        customerName: user?.name,
        customerPhone: address?.phone,
        address,
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      return order;
    },
    updateOrderStatus: (id, status) =>
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x))),
    deleteOrder: (id) => setOrders((o) => o.filter((x) => x.id !== id)),
    series,
    findSeries,
    byCategory: (c) => series.filter((s) => s.category === c),
    addSeries: (s) => setSeries((arr) => [s, ...arr]),
    updateSeries: (id, patch) =>
      setSeries((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    deleteSeries: (id) => setSeries((arr) => arr.filter((s) => s.id !== id)),
    requests,
    submitRequest: (r) =>
      setRequests((list) => [
        { id: `REQ-${Date.now().toString(36).toUpperCase()}`, createdAt: Date.now(), status: "open", ...r },
        ...list,
      ]),
    updateRequestStatus: (id, status) =>
      setRequests((list) => list.map((r) => (r.id === id ? { ...r, status } : r))),
    deleteRequest: (id) => setRequests((list) => list.filter((r) => r.id !== id)),
    slides,
    addSlide: (s) =>
      setSlides((arr) => [
        ...arr,
        { id: `slide-${Date.now().toString(36)}`, order: arr.length, ...s },
      ]),
    updateSlide: (id, patch) =>
      setSlides((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s))),
    deleteSlide: (id) => setSlides((arr) => arr.filter((s) => s.id !== id)),
    reorderSlide: (id, dir) =>
      setSlides((arr) => {
        const sorted = [...arr].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((s) => s.id === id);
        const swap = idx + dir;
        if (idx < 0 || swap < 0 || swap >= sorted.length) return arr;
        const a = sorted[idx], b = sorted[swap];
        const ao = a.order; a.order = b.order; b.order = ao;
        return [...sorted];
      }),
    offers,
    addOffer: (o) =>
      setOffers((arr) => [...arr, { id: `offer-${Date.now().toString(36)}`, order: arr.length, ...o }]),
    updateOffer: (id, patch) =>
      setOffers((arr) => arr.map((o) => (o.id === id ? { ...o, ...patch } : o))),
    deleteOffer: (id) => setOffers((arr) => arr.filter((o) => o.id !== id)),
    reorderOffer: (id, dir) =>
      setOffers((arr) => {
        const sorted = [...arr].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((o) => o.id === id);
        const swap = idx + dir;
        if (idx < 0 || swap < 0 || swap >= sorted.length) return arr;
        const a = sorted[idx], b = sorted[swap];
        const ao = a.order; a.order = b.order; b.order = ao;
        return [...sorted];
      }),
    addresses,
    addAddress: (a) => {
      const n: Address = { id: `ADDR-${Date.now().toString(36)}`, ...a };
      setAddresses((arr) => [n, ...arr]);
      return n;
    },
    updateAddress: (id, patch) =>
      setAddresses((arr) => arr.map((a) => (a.id === id ? { ...a, ...patch } : a))),
    deleteAddress: (id) => setAddresses((arr) => arr.filter((a) => a.id !== id)),
    settings,
    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}

export const THEME_PRESETS: ThemePreset[] = ["red", "gold", "blue", "emerald", "violet", "rose"];
export const THEME_PRESET_SWATCH: Record<ThemePreset, string> = {
  red: "oklch(0.58 0.24 25)",
  gold: "oklch(0.78 0.16 85)",
  blue: "oklch(0.6 0.2 250)",
  emerald: "oklch(0.62 0.18 155)",
  violet: "oklch(0.58 0.22 295)",
  rose: "oklch(0.65 0.22 5)",
};
