import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Series, Category } from "./data";

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
  popupActive: boolean;
  popupTitleAr?: string;
  popupTitleEn?: string;
  popupTextAr?: string;
  popupTextEn?: string;
  whatsappNumber?: string;
}

export interface CategoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  active: boolean;
  order: number;
}

export interface Wallet {
  id: string;
  name: string;
  number: string;
  icon?: string;
  active: boolean;
  order: number;
}

export interface AdminUser {
  id: string;
  email: string | null;
  name: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  roles: string[];
}

export interface Review {
  id: string;
  seriesId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

interface Store {
  user: User | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
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
  placeOrder: (paymentMethod: Order["paymentMethod"], receiptName?: string, address?: Address) => Promise<Order | null>;
  updateOrderStatus: (id: string, status: Order["status"]) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  series: Series[];
  findSeries: (id: string) => Series | undefined;
  byCategory: (c: Category) => Series[];
  addSeries: (s: Series) => Promise<void>;
  updateSeries: (id: string, patch: Partial<Series>) => Promise<void>;
  deleteSeries: (id: string) => Promise<void>;
  requests: SeriesRequest[];
  submitRequest: (r: Omit<SeriesRequest, "id" | "createdAt" | "status">) => Promise<void>;
  updateRequestStatus: (id: string, status: SeriesRequest["status"]) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  slides: Slide[];
  addSlide: (s: Omit<Slide, "id" | "order">) => Promise<void>;
  updateSlide: (id: string, patch: Partial<Slide>) => Promise<void>;
  deleteSlide: (id: string) => Promise<void>;
  reorderSlide: (id: string, dir: -1 | 1) => Promise<void>;
  offers: Offer[];
  addOffer: (o: Omit<Offer, "id" | "order">) => Promise<void>;
  updateOffer: (id: string, patch: Partial<Offer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  reorderOffer: (id: string, dir: -1 | 1) => Promise<void>;
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Promise<Address | null>;
  updateAddress: (id: string, patch: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  reviews: Review[];
  fetchReviews: (seriesId: string) => Promise<Review[]>;
  addReview: (seriesId: string, rating: number, comment: string) => Promise<{ error: string | null }>;
  deleteReview: (id: string) => Promise<void>;
  wallets: Wallet[];
  addWallet: (w: Omit<Wallet, "id" | "order">) => Promise<void>;
  updateWallet: (id: string, patch: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  categories: CategoryItem[];
  addCategory: (c: Omit<CategoryItem, "order">) => Promise<{ error: string | null }>;
  updateCategory: (id: string, patch: Partial<CategoryItem>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  listAdminUsers: () => Promise<AdminUser[]>;
  deleteAdminUser: (id: string) => Promise<{ error: string | null }>;
  resetAdminUserPassword: (email: string) => Promise<{ error: string | null; link?: string | null }>;
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

// ---------- Mappers DB <-> App ----------
const mapSeries = (r: any): Series => ({
  id: r.id,
  slug: r.slug,
  title: { ar: r.title_ar, en: r.title_en },
  description: { ar: r.description_ar ?? "", en: r.description_en ?? "" },
  category: r.category,
  genres: r.genres ?? [],
  year: r.year,
  imdb: Number(r.imdb),
  seasons: r.seasons,
  episodes: r.episodes,
  source: r.source,
  posterColor: r.poster_color,
  posterImage: r.poster_image ?? undefined,
  backgroundImage: r.background_image ?? undefined,
  trailerUrl: r.trailer_url ?? "",
  price: Number(r.price),
  trending: r.trending,
  isNew: r.is_new,
  topWatched: r.top_watched,
  featured: r.featured,
  relatedIds: Array.isArray(r.related_ids) ? r.related_ids : [],
});

const seriesToRow = (s: Partial<Series> & { id?: string }) => ({
  id: s.id,
  slug: s.slug ?? s.id,
  title_ar: s.title?.ar,
  title_en: s.title?.en,
  description_ar: s.description?.ar ?? "",
  description_en: s.description?.en ?? "",
  category: s.category,
  genres: s.genres ?? [],
  year: s.year ?? 0,
  imdb: s.imdb ?? 0,
  seasons: s.seasons ?? 1,
  episodes: s.episodes ?? 1,
  source: s.source ?? "Original",
  poster_color: s.posterColor ?? "from-rose-700 via-red-900 to-zinc-950",
  poster_image: s.posterImage ?? null,
  background_image: s.backgroundImage ?? null,
  trailer_url: s.trailerUrl ?? "",
  price: s.price ?? 0,
  trending: !!s.trending,
  is_new: !!s.isNew,
  top_watched: !!s.topWatched,
  featured: !!s.featured,
  related_ids: s.relatedIds ?? [],
});

const mapOffer = (r: any): Offer => ({
  id: r.id,
  titleAr: r.title_ar,
  titleEn: r.title_en,
  descriptionAr: r.description_ar ?? "",
  descriptionEn: r.description_en ?? "",
  badgeAr: r.badge_ar ?? undefined,
  badgeEn: r.badge_en ?? undefined,
  discountPct: r.discount_pct ?? undefined,
  gradient: r.gradient,
  ctaUrl: r.cta_url ?? undefined,
  seriesId: r.series_id ?? undefined,
  active: r.active,
  expiresAt: r.expires_at ? new Date(r.expires_at).getTime() : undefined,
  order: r.sort_order,
});
const offerToRow = (o: Partial<Offer>) => ({
  title_ar: o.titleAr,
  title_en: o.titleEn,
  description_ar: o.descriptionAr ?? "",
  description_en: o.descriptionEn ?? "",
  badge_ar: o.badgeAr ?? null,
  badge_en: o.badgeEn ?? null,
  discount_pct: o.discountPct ?? null,
  gradient: o.gradient ?? "from-rose-700 via-red-900 to-zinc-950",
  cta_url: o.ctaUrl ?? null,
  series_id: o.seriesId ?? null,
  active: o.active ?? true,
  expires_at: o.expiresAt ? new Date(o.expiresAt).toISOString() : null,
  sort_order: o.order ?? 0,
});

const mapSlide = (r: any): Slide => ({
  id: r.id,
  titleAr: r.title_ar,
  titleEn: r.title_en,
  subtitleAr: r.subtitle_ar ?? "",
  subtitleEn: r.subtitle_en ?? "",
  gradient: r.gradient,
  image: r.image ?? undefined,
  seriesId: r.series_id ?? undefined,
  ctaUrl: r.cta_url ?? undefined,
  active: r.active,
  order: r.sort_order,
});
const slideToRow = (s: Partial<Slide>) => ({
  title_ar: s.titleAr,
  title_en: s.titleEn,
  subtitle_ar: s.subtitleAr ?? "",
  subtitle_en: s.subtitleEn ?? "",
  gradient: s.gradient ?? "from-rose-700 via-red-900 to-zinc-950",
  image: s.image ?? null,
  series_id: s.seriesId ?? null,
  cta_url: s.ctaUrl ?? null,
  active: s.active ?? true,
  sort_order: s.order ?? 0,
});

const mapAddress = (r: any): Address => ({
  id: r.id,
  label: r.label ?? "",
  fullName: r.full_name ?? "",
  phone: r.phone ?? "",
  city: r.city ?? "",
  district: r.district ?? undefined,
  street: r.street ?? undefined,
  details: r.details ?? undefined,
  mapUrl: r.map_url ?? undefined,
  lat: r.lat != null ? Number(r.lat) : undefined,
  lng: r.lng != null ? Number(r.lng) : undefined,
});
const addressToRow = (a: Partial<Address>) => ({
  label: a.label ?? "",
  full_name: a.fullName ?? "",
  phone: a.phone ?? "",
  city: a.city ?? "",
  district: a.district ?? null,
  street: a.street ?? null,
  details: a.details ?? null,
  map_url: a.mapUrl ?? null,
  lat: a.lat ?? null,
  lng: a.lng ?? null,
});

const mapOrder = (r: any): Order => ({
  id: r.id,
  items: r.items ?? [],
  total: Number(r.total),
  paymentMethod: r.payment_method,
  status: r.status,
  createdAt: new Date(r.created_at).getTime(),
  receiptName: r.receipt_name ?? undefined,
  customerEmail: r.customer_email ?? undefined,
  customerName: r.customer_name ?? undefined,
  customerPhone: r.customer_phone ?? undefined,
  address: r.address ?? undefined,
});

const mapRequest = (r: any): SeriesRequest => ({
  id: r.id,
  title: r.title,
  details: r.details ?? "",
  status: r.status,
  createdAt: new Date(r.created_at).getTime(),
  userEmail: r.user_email ?? undefined,
});

const mapReview = (r: any): Review => ({
  id: r.id,
  seriesId: r.series_id,
  userId: r.user_id,
  userName: r.user_name ?? "",
  rating: Number(r.rating),
  comment: r.comment ?? "",
  createdAt: new Date(r.created_at).getTime(),
});

const mapSettings = (r: any): Settings => ({
  logoText: r.logo_text ?? "MOVANA",
  logoUrl: r.logo_url ?? undefined,
  themePreset: (r.theme_preset ?? "red") as ThemePreset,
  themeMode: (r.theme_mode ?? "dark") as ThemeMode,
  popupActive: !!r.popup_active,
  popupTitleAr: r.popup_title_ar ?? undefined,
  popupTitleEn: r.popup_title_en ?? undefined,
  popupTextAr: r.popup_text_ar ?? undefined,
  popupTextEn: r.popup_text_en ?? undefined,
  whatsappNumber: r.whatsapp_number ?? undefined,
});

// ---------- Theme application ----------
const PRESETS: Record<ThemePreset, { primary: string; accent: string; ring: string; gradFrom: string; gradTo: string }> = {
  red:     { primary: "oklch(0.58 0.24 25)",  accent: "oklch(0.65 0.22 28)",  ring: "oklch(0.58 0.24 25)",  gradFrom: "oklch(0.58 0.24 25)",  gradTo: "oklch(0.45 0.22 22)" },
  gold:    { primary: "oklch(0.78 0.16 85)",  accent: "oklch(0.82 0.15 85)",  ring: "oklch(0.78 0.16 85)",  gradFrom: "oklch(0.78 0.16 85)",  gradTo: "oklch(0.6 0.16 70)" },
  blue:    { primary: "oklch(0.6 0.2 250)",   accent: "oklch(0.66 0.18 245)", ring: "oklch(0.6 0.2 250)",   gradFrom: "oklch(0.6 0.2 250)",   gradTo: "oklch(0.45 0.2 255)" },
  emerald: { primary: "oklch(0.62 0.18 155)", accent: "oklch(0.68 0.16 158)", ring: "oklch(0.62 0.18 155)", gradFrom: "oklch(0.62 0.18 155)", gradTo: "oklch(0.45 0.18 158)" },
  violet:  { primary: "oklch(0.58 0.22 295)", accent: "oklch(0.65 0.2 295)",  ring: "oklch(0.58 0.22 295)", gradFrom: "oklch(0.58 0.22 295)", gradTo: "oklch(0.42 0.22 290)" },
  rose:    { primary: "oklch(0.65 0.22 5)",   accent: "oklch(0.7 0.2 8)",     ring: "oklch(0.65 0.22 5)",   gradFrom: "oklch(0.65 0.22 5)",   gradTo: "oklch(0.5 0.22 5)" },
};
const MODES = {
  dark: { background: "oklch(0.13 0.015 20)", foreground: "oklch(0.98 0.005 0)", card: "oklch(0.17 0.018 20)", muted: "oklch(0.22 0.015 20)", mutedFg: "oklch(0.7 0.01 20)", border: "oklch(0.27 0.02 20 / 60%)", input: "oklch(0.25 0.02 20)", secondary: "oklch(0.22 0.02 20)" },
  light: { background: "oklch(0.98 0.005 20)", foreground: "oklch(0.18 0.015 20)", card: "oklch(1 0 0)", muted: "oklch(0.95 0.01 20)", mutedFg: "oklch(0.45 0.01 20)", border: "oklch(0.85 0.01 20 / 80%)", input: "oklch(0.94 0.01 20)", secondary: "oklch(0.94 0.01 20)" },
};
function applyTheme(s: Settings) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const p = PRESETS[s.themePreset] ?? PRESETS.red;
  const m = MODES[s.themeMode] ?? MODES.dark;
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

const defaultSettings: Settings = { logoText: "MOVANA", logoUrl: undefined, themePreset: "red", themeMode: "dark", popupActive: false };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>(() => read<CartItem[]>("movana_cart", []));
  const [favorites, setFavorites] = useState<string[]>(() => read<string[]>("movana_fav", []));
  const [orders, setOrders] = useState<Order[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [requests, setRequests] = useState<SeriesRequest[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  // Persist guest cart + favorites
  useEffect(() => { localStorage.setItem("movana_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (!user) localStorage.setItem("movana_fav", JSON.stringify(favorites)); }, [favorites, user]);

  // ---------- Initial public data ----------
  const fetchPublic = async () => {
    const [s, o, sl, st, w, c] = await Promise.all([
      supabase.from("series").select("*").order("created_at", { ascending: true }),
      supabase.from("offers").select("*").order("sort_order", { ascending: true }),
      supabase.from("slides").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("wallets").select("*").order("sort_order", { ascending: true }),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ]);
    if (s.data) setSeries(s.data.map(mapSeries));
    if (o.data) setOffers(o.data.map(mapOffer));
    if (sl.data) setSlides(sl.data.map(mapSlide));
    if (w.data) setWallets(w.data.map((r: any) => ({ id: r.id, name: r.name, number: r.number, icon: r.icon ?? undefined, active: r.active, order: r.sort_order })));
    if (c.data) setCategories(c.data.map((r: any) => ({ id: r.id, nameAr: r.name_ar, nameEn: r.name_en, active: r.active, order: r.sort_order })));
    if (st.data) {
      const ms = mapSettings(st.data);
      setSettings(ms);
      applyTheme(ms);
    } else {
      applyTheme(defaultSettings);
    }
  };

  useEffect(() => { fetchPublic(); }, []);

  // ---------- Auth bootstrap ----------
  const hydrateUser = async (sessionUserId: string, email: string) => {
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", sessionUserId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", sessionUserId),
    ]);
    const isAdmin = !!roles?.some((r: any) => r.role === "admin");
    setUser({
      id: sessionUserId,
      email,
      name: profile?.name || email.split("@")[0],
      isAdmin,
    });
  };

  const fetchUserData = async (uid: string) => {
    const [o, r, a, f] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("series_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("addresses").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("favorites").select("series_id").eq("user_id", uid),
    ]);
    if (o.data) setOrders(o.data.map(mapOrder));
    if (r.data) setRequests(r.data.map(mapRequest));
    if (a.data) setAddresses(a.data.map(mapAddress));
    if (f.data) setFavorites(f.data.map((x: any) => x.series_id));
  };

  useEffect(() => {
    // Set up listener FIRST then fetch session
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // defer DB calls to avoid deadlock
        setTimeout(() => {
          hydrateUser(session.user.id, session.user.email ?? "");
          fetchUserData(session.user.id);
        }, 0);
      } else {
        setUser(null);
        setOrders([]);
        setRequests([]);
        setAddresses([]);
        setFavorites(read<string[]>("movana_fav", []));
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        hydrateUser(session.user.id, session.user.email ?? "");
        fetchUserData(session.user.id);
      }
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const findSeries = (id: string) => series.find((s) => s.id === id);
  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (findSeries(i.seriesId)?.price ?? 0) * i.qty, 0),
    [cart, series] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  // ---------- Auth actions ----------
  const signIn: Store["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };
  const signUp: Store["signUp"] = async (email, password, name) => {
    const redirect = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirect, data: { name } },
    });
    return { error: error?.message ?? null };
  };
  const logout = async () => { await supabase.auth.signOut(); };

  // ---------- Mutations ----------
  const value: Store = {
    user,
    authLoading,
    signIn,
    signUp,
    logout,
    cart,
    addToCart: (id, qty = 1) =>
      setCart((c) => {
        const e = c.find((i) => i.seriesId === id);
        if (e) return c.map((i) => (i.seriesId === id ? { ...i, qty: i.qty + qty } : i));
        return [...c, { seriesId: id, qty }];
      }),
    removeFromCart: (id) => setCart((c) => c.filter((i) => i.seriesId !== id)),
    setQty: (id, qty) => setCart((c) => c.map((i) => (i.seriesId === id ? { ...i, qty: Math.max(1, qty) } : i))),
    clearCart: () => setCart([]),
    cartTotal,
    cartCount,

    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite: (id) => {
      const has = favorites.includes(id);
      setFavorites((f) => (has ? f.filter((x) => x !== id) : [...f, id]));
      if (user) {
        if (has) supabase.from("favorites").delete().eq("user_id", user.id).eq("series_id", id);
        else supabase.from("favorites").insert({ user_id: user.id, series_id: id } as any);
      }
    },

    orders,
    placeOrder: async (paymentMethod, receiptName, address) => {
      if (!user) return null;
      const payload = {
        user_id: user.id,
        items: cart,
        total: cartTotal,
        payment_method: paymentMethod,
        status: "pending" as const,
        receipt_name: receiptName ?? null,
        customer_name: user.name,
        customer_email: user.email,
        customer_phone: address?.phone ?? null,
        address: address ?? null,
      };
      const { data, error } = await supabase.from("orders").insert(payload as any).select("*").single();
      if (error || !data) return null;
      const ord = mapOrder(data);
      setOrders((o) => [ord, ...o]);
      setCart([]);
      return ord;
    },
    updateOrderStatus: async (id, status) => {
      await supabase.from("orders").update({ status }).eq("id", id);
      setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x)));
    },
    deleteOrder: async (id) => {
      await supabase.from("orders").delete().eq("id", id);
      setOrders((o) => o.filter((x) => x.id !== id));
    },

    series,
    findSeries,
    byCategory: (c) => series.filter((s) => s.category === c),
    addSeries: async (s) => {
      const { data, error } = await supabase.from("series").insert(seriesToRow(s) as any).select("*").single();
      if (!error && data) setSeries((arr) => [mapSeries(data), ...arr]);
    },
    updateSeries: async (id, patch) => {
      const row: any = {};
      const r = seriesToRow({ ...patch, id });
      // only include keys that are present in patch (avoid clobbering with defaults)
      if (patch.slug !== undefined) row.slug = r.slug;
      if (patch.title) { row.title_ar = r.title_ar; row.title_en = r.title_en; }
      if (patch.description) { row.description_ar = r.description_ar; row.description_en = r.description_en; }
      if (patch.category !== undefined) row.category = r.category;
      if (patch.genres !== undefined) row.genres = r.genres;
      if (patch.year !== undefined) row.year = r.year;
      if (patch.imdb !== undefined) row.imdb = r.imdb;
      if (patch.seasons !== undefined) row.seasons = r.seasons;
      if (patch.episodes !== undefined) row.episodes = r.episodes;
      if (patch.source !== undefined) row.source = r.source;
      if (patch.posterColor !== undefined) row.poster_color = r.poster_color;
      if (patch.posterImage !== undefined) row.poster_image = r.poster_image;
      if (patch.backgroundImage !== undefined) row.background_image = r.background_image;
      if (patch.relatedIds !== undefined) row.related_ids = r.related_ids;
      if (patch.trailerUrl !== undefined) row.trailer_url = r.trailer_url;
      if (patch.price !== undefined) row.price = r.price;
      if (patch.trending !== undefined) row.trending = r.trending;
      if (patch.isNew !== undefined) row.is_new = r.is_new;
      if (patch.topWatched !== undefined) row.top_watched = r.top_watched;
      if (patch.featured !== undefined) row.featured = r.featured;
      const { data } = await supabase.from("series").update(row).eq("id", id).select("*").single();
      if (data) setSeries((arr) => arr.map((s) => (s.id === id ? mapSeries(data) : s)));
    },
    deleteSeries: async (id) => {
      await supabase.from("series").delete().eq("id", id);
      setSeries((arr) => arr.filter((s) => s.id !== id));
    },

    requests,
    submitRequest: async (r) => {
      if (!user) return;
      const { data } = await supabase
        .from("series_requests")
        .insert({ user_id: user.id, user_email: r.userEmail ?? user.email, title: r.title, details: r.details } as any)
        .select("*")
        .single();
      if (data) setRequests((list) => [mapRequest(data), ...list]);
    },
    updateRequestStatus: async (id, status) => {
      await supabase.from("series_requests").update({ status }).eq("id", id);
      setRequests((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
    },
    deleteRequest: async (id) => {
      await supabase.from("series_requests").delete().eq("id", id);
      setRequests((list) => list.filter((r) => r.id !== id));
    },

    slides,
    addSlide: async (s) => {
      const sort_order = slides.length;
      const { data } = await supabase.from("slides").insert({ ...slideToRow(s), sort_order } as any).select("*").single();
      if (data) setSlides((arr) => [...arr, mapSlide(data)]);
    },
    updateSlide: async (id, patch) => {
      const row: any = {};
      if (patch.titleAr !== undefined) row.title_ar = patch.titleAr;
      if (patch.titleEn !== undefined) row.title_en = patch.titleEn;
      if (patch.subtitleAr !== undefined) row.subtitle_ar = patch.subtitleAr;
      if (patch.subtitleEn !== undefined) row.subtitle_en = patch.subtitleEn;
      if (patch.gradient !== undefined) row.gradient = patch.gradient;
      if (patch.image !== undefined) row.image = patch.image ?? null;
      if (patch.seriesId !== undefined) row.series_id = patch.seriesId ?? null;
      if (patch.ctaUrl !== undefined) row.cta_url = patch.ctaUrl ?? null;
      if (patch.active !== undefined) row.active = patch.active;
      if (patch.order !== undefined) row.sort_order = patch.order;
      const { data } = await supabase.from("slides").update(row).eq("id", id).select("*").single();
      if (data) setSlides((arr) => arr.map((s) => (s.id === id ? mapSlide(data) : s)));
    },
    deleteSlide: async (id) => {
      await supabase.from("slides").delete().eq("id", id);
      setSlides((arr) => arr.filter((s) => s.id !== id));
    },
    reorderSlide: async (id, dir) => {
      const sorted = [...slides].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return;
      const a = sorted[idx], b = sorted[swap];
      const ao = a.order, bo = b.order;
      await Promise.all([
        supabase.from("slides").update({ sort_order: bo }).eq("id", a.id),
        supabase.from("slides").update({ sort_order: ao }).eq("id", b.id),
      ]);
      setSlides((arr) => arr.map((s) => s.id === a.id ? { ...s, order: bo } : s.id === b.id ? { ...s, order: ao } : s));
    },

    offers,
    addOffer: async (o) => {
      const sort_order = offers.length;
      const { data } = await supabase.from("offers").insert({ ...offerToRow(o), sort_order } as any).select("*").single();
      if (data) setOffers((arr) => [...arr, mapOffer(data)]);
    },
    updateOffer: async (id, patch) => {
      const row: any = {};
      if (patch.titleAr !== undefined) row.title_ar = patch.titleAr;
      if (patch.titleEn !== undefined) row.title_en = patch.titleEn;
      if (patch.descriptionAr !== undefined) row.description_ar = patch.descriptionAr;
      if (patch.descriptionEn !== undefined) row.description_en = patch.descriptionEn;
      if (patch.badgeAr !== undefined) row.badge_ar = patch.badgeAr ?? null;
      if (patch.badgeEn !== undefined) row.badge_en = patch.badgeEn ?? null;
      if (patch.discountPct !== undefined) row.discount_pct = patch.discountPct ?? null;
      if (patch.gradient !== undefined) row.gradient = patch.gradient;
      if (patch.ctaUrl !== undefined) row.cta_url = patch.ctaUrl ?? null;
      if (patch.seriesId !== undefined) row.series_id = patch.seriesId ?? null;
      if (patch.active !== undefined) row.active = patch.active;
      if (patch.expiresAt !== undefined) row.expires_at = patch.expiresAt ? new Date(patch.expiresAt).toISOString() : null;
      if (patch.order !== undefined) row.sort_order = patch.order;
      const { data } = await supabase.from("offers").update(row).eq("id", id).select("*").single();
      if (data) setOffers((arr) => arr.map((o) => (o.id === id ? mapOffer(data) : o)));
    },
    deleteOffer: async (id) => {
      await supabase.from("offers").delete().eq("id", id);
      setOffers((arr) => arr.filter((o) => o.id !== id));
    },
    reorderOffer: async (id, dir) => {
      const sorted = [...offers].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((o) => o.id === id);
      const swap = idx + dir;
      if (idx < 0 || swap < 0 || swap >= sorted.length) return;
      const a = sorted[idx], b = sorted[swap];
      const ao = a.order, bo = b.order;
      await Promise.all([
        supabase.from("offers").update({ sort_order: bo }).eq("id", a.id),
        supabase.from("offers").update({ sort_order: ao }).eq("id", b.id),
      ]);
      setOffers((arr) => arr.map((o) => o.id === a.id ? { ...o, order: bo } : o.id === b.id ? { ...o, order: ao } : o));
    },

    addresses,
    addAddress: async (a) => {
      if (!user) return null;
      const { data } = await supabase.from("addresses").insert({ user_id: user.id, ...addressToRow(a) } as any).select("*").single();
      if (!data) return null;
      const m = mapAddress(data);
      setAddresses((arr) => [m, ...arr]);
      return m;
    },
    updateAddress: async (id, patch) => {
      const { data } = await supabase.from("addresses").update(addressToRow(patch)).eq("id", id).select("*").single();
      if (data) setAddresses((arr) => arr.map((a) => (a.id === id ? mapAddress(data) : a)));
    },
    deleteAddress: async (id) => {
      await supabase.from("addresses").delete().eq("id", id);
      setAddresses((arr) => arr.filter((a) => a.id !== id));
    },

    settings,
    updateSettings: async (patch) => {
      const merged = { ...settings, ...patch };
      setSettings(merged);
      applyTheme(merged);
      await supabase.from("site_settings").update({
        logo_text: merged.logoText,
        logo_url: merged.logoUrl ?? null,
        theme_preset: merged.themePreset,
        theme_mode: merged.themeMode,
      }).eq("id", 1);
    },

    reviews,
    fetchReviews: async (seriesId) => {
      const { data } = await supabase.from("reviews").select("*").eq("series_id", seriesId).order("created_at", { ascending: false });
      const list = (data ?? []).map(mapReview);
      setReviews((prev) => [...prev.filter((r) => r.seriesId !== seriesId), ...list]);
      return list;
    },
    addReview: async (seriesId, rating, comment) => {
      if (!user) return { error: "not_authenticated" };
      const { data, error } = await supabase.from("reviews").insert({
        series_id: seriesId, user_id: user.id, user_name: user.name, rating, comment,
      } as any).select("*").single();
      if (error || !data) return { error: error?.message ?? "failed" };
      setReviews((prev) => [mapReview(data), ...prev]);
      return { error: null };
    },
    deleteReview: async (id) => {
      await supabase.from("reviews").delete().eq("id", id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    },

    wallets,
    addWallet: async (w) => {
      const sort_order = wallets.length;
      const { data } = await supabase.from("wallets").insert({ name: w.name, number: w.number, icon: w.icon ?? null, active: w.active ?? true, sort_order } as any).select("*").single();
      if (data) setWallets((arr) => [...arr, { id: data.id, name: data.name, number: data.number, icon: data.icon ?? undefined, active: data.active, order: data.sort_order }]);
    },
    updateWallet: async (id, patch) => {
      const row: any = {};
      if (patch.name !== undefined) row.name = patch.name;
      if (patch.number !== undefined) row.number = patch.number;
      if (patch.icon !== undefined) row.icon = patch.icon ?? null;
      if (patch.active !== undefined) row.active = patch.active;
      if (patch.order !== undefined) row.sort_order = patch.order;
      const { data } = await supabase.from("wallets").update(row).eq("id", id).select("*").single();
      if (data) setWallets((arr) => arr.map((w) => w.id === id ? { id: data.id, name: data.name, number: data.number, icon: data.icon ?? undefined, active: data.active, order: data.sort_order } : w));
    },
    deleteWallet: async (id) => {
      await supabase.from("wallets").delete().eq("id", id);
      setWallets((arr) => arr.filter((w) => w.id !== id));
    },

    listAdminUsers: async () => {
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "list" } });
      if (error || !data?.users) return [];
      return data.users as AdminUser[];
    },
    deleteAdminUser: async (id) => {
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "delete", id } });
      if (error) return { error: error.message };
      if (data?.error) return { error: data.error };
      return { error: null };
    },
    resetAdminUserPassword: async (email) => {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "reset_password", email, redirectTo } });
      if (error) return { error: error.message };
      if (data?.error) return { error: data.error };
      return { error: null, link: data?.action_link ?? null };
    },
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
