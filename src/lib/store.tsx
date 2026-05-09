import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { findSeries } from "./data";

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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(read<User | null>("movana_user", null));
    setCart(read<CartItem[]>("movana_cart", []));
    setFavorites(read<string[]>("movana_fav", []));
    setOrders(read<Order[]>("movana_orders", []));
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem("movana_user", JSON.stringify(user)); }, [user, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_cart", JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_fav", JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem("movana_orders", JSON.stringify(orders)); }, [orders, hydrated]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, i) => sum + (findSeries(i.seriesId)?.price ?? 0) * i.qty, 0),
    [cart]
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
      };
      setOrders((o) => [order, ...o]);
      setCart([]);
      return order;
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
