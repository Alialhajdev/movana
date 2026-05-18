import { Routes, Route, Link } from "react-router-dom";
import Index from "./routes/index";
import Category from "./routes/Category";
import SeriesDetail from "./routes/SeriesDetail";
import Cart from "./routes/cart";
import Checkout from "./routes/checkout";
import OrderConfirm from "./routes/OrderConfirm";
import Favorites from "./routes/favorites";
import Login from "./routes/login";
import Register from "./routes/register";
import Profile from "./routes/profile";
import Requests from "./routes/requests";
import Search from "./routes/search";
import Admin from "./routes/admin";
import { ScrollToTop } from "./components/ScrollToTop";
import { WelcomePopup } from "./components/WelcomePopup";
import { WhatsAppFab } from "./components/WhatsAppFab";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/series/:id" element={<SeriesDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirm/:id" element={<OrderConfirm />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WelcomePopup />
      <WhatsAppFab />
    </>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <p className="mt-4 text-muted-foreground">الصفحة غير موجودة / Page not found</p>
        <Link to="/" className="mt-6 inline-block rounded-md gradient-red px-5 py-2.5 text-sm font-bold">
          الرئيسية / Home
        </Link>
      </div>
    </div>
  );
}
