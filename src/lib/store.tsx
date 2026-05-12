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
  gradient: string; // tailwind gradient classes
  image?: string;   // optional image URL
  seriesId?: string;
  ctaUrl?: string;
  active: boolean;
  order: number;
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
  placeOrder: (paymentMethod: Order["paymentMethod"], receiptName?: string) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  deleteOrder: (id: string) => void;
  // series
  series: Series[];
  findSeries: (id: string) => Series | undefined;
  byCategory: (c: Category) => Series[];
  addSeries: (s: Series) => void;
  updateSeries: (id: string, patch: Partial<Series>) => void;
  deleteSeries: (id: string) => void;
  // requests
  requests: SeriesRequest[];
  submitRequest: (r: Omit<SeriesRequest, "id" | "createdAt" | "status">) => void;
  updateRequestStatus: (id: string, status: SeriesRequest["status"]) => void;
  deleteRequest: (id: string) => void;
  // slides
  slides: Slide[];
  addSlide: (s: Omit<Slide, "id" | "order">) => void;
  updateSlide: (id: string, patch: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (id: string, dir: -1 | 1) => void;
  // offers
  offers: Offer[];
  addOffer: (o: Omit<Offer, "id" | "order">) => void;
  updateOffer: (id: string, patch: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  reorderOffer: (id: string, dir: -1 | 1) => void;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [series, setSeries] = useState<Series[]>(seedSeries);
  const [requests, setRequests] = useState<SeriesRequest[]>([]);
  const [slides, setSlides] = useState<Slide[]>(defaultSlides());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(read<User | null>("movana_user", null));
    setCart(read<CartItem[]>("movana_cart", []));
    setFavorites(read<string[]>("movana_fav", []));
    setOrders(read<Order[]>("movana_orders", []));
    setSeries(read<Series[]>("movana_series", seedSeries));
    setRequests(read<SeriesRequest[]>("movana_requests", []));
    setSlides(read<Slide[]>("movana_slides", defaultSlides()));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("movana_user", JSON.stringify(user)); }, [user, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_fav", JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_orders", JSON.stringify(orders)); }, [orders, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_series", JSON.stringify(series)); }, [series, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_requests", JSON.stringify(requests)); }, [requests, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_slides", JSON.stringify(slides)); }, [slides, hydrated]);

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
    placeOrder: (paymentMethod, receiptName) => {
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
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
