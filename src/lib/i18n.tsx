import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const dict: Dict = {
  brand: { ar: "موڤانا", en: "Movana" },
  tagline: { ar: "متجر المسلسلات الأول", en: "Premium Series Marketplace" },
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_korean: { ar: "كوري", en: "Korean" },
  nav_turkish: { ar: "تركي", en: "Turkish" },
  nav_english: { ar: "أجنبي", en: "English" },
  nav_trending: { ar: "الرائج", en: "Trending" },
  nav_new: { ar: "الجديد", en: "New" },
  nav_search: { ar: "بحث", en: "Search" },
  nav_favorites: { ar: "المفضلة", en: "Favorites" },
  nav_cart: { ar: "السلة", en: "Cart" },
  nav_login: { ar: "تسجيل الدخول", en: "Sign in" },
  nav_register: { ar: "إنشاء حساب", en: "Sign up" },
  nav_profile: { ar: "حسابي", en: "My account" },
  nav_orders: { ar: "طلباتي", en: "Orders" },
  nav_requests: { ar: "طلب مسلسل", en: "Request a series" },
  nav_admin: { ar: "لوحة الإدارة", en: "Admin" },
  nav_logout: { ar: "خروج", en: "Logout" },
  hero_watch_trailer: { ar: "مشاهدة الإعلان", en: "Watch Trailer" },
  hero_add_cart: { ar: "أضف إلى السلة", en: "Add to Cart" },
  hero_add_fav: { ar: "أضف للمفضلة", en: "Add to Favorites" },
  view_more: { ar: "عرض المزيد", en: "View more" },
  cat_korean: { ar: "مسلسلات كورية", en: "Korean Series" },
  cat_turkish: { ar: "مسلسلات تركية", en: "Turkish Series" },
  cat_english: { ar: "مسلسلات أجنبية", en: "English Series" },
  cat_trending: { ar: "الأكثر رواجاً", en: "Trending Now" },
  cat_new: { ar: "أصدرت حديثاً", en: "New Releases" },
  cat_top: { ar: "الأكثر مشاهدة", en: "Most Watched" },
  imdb: { ar: "IMDB", en: "IMDB" },
  seasons: { ar: "موسم", en: "Seasons" },
  episodes: { ar: "حلقة", en: "Episodes" },
  year: { ar: "السنة", en: "Year" },
  genre: { ar: "النوع", en: "Genre" },
  search_placeholder: { ar: "ابحث عن مسلسل، نوع، ممثل…", en: "Search series, genre, actor…" },
  filter: { ar: "فلترة", en: "Filter" },
  all: { ar: "الكل", en: "All" },
  related: { ar: "مسلسلات مشابهة", en: "Related" },
  trailer: { ar: "الإعلان الترويجي", en: "Trailer" },
  screenshots: { ar: "لقطات", en: "Screenshots" },
  reviews: { ar: "المراجعات", en: "Reviews" },
  description: { ar: "الوصف", en: "Description" },
  cart_empty: { ar: "سلة المشتريات فارغة", en: "Your cart is empty" },
  cart_subtotal: { ar: "المجموع", en: "Subtotal" },
  cart_total: { ar: "الإجمالي", en: "Total" },
  cart_qty: { ar: "الكمية", en: "Qty" },
  cart_remove: { ar: "حذف", en: "Remove" },
  cart_checkout: { ar: "إتمام الطلب", en: "Checkout" },
  step_cart: { ar: "السلة", en: "Cart" },
  step_payment: { ar: "الدفع", en: "Payment" },
  step_confirm: { ar: "التأكيد", en: "Confirm" },
  pay_method: { ar: "طريقة الدفع", en: "Payment method" },
  pay_wallet_transfer: { ar: "تحويل محفظة", en: "Wallet Transfer" },
  pay_cod: { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
  pay_wallet: { ar: "دفع بالمحفظة", en: "Wallet Payment" },
  pay_account: { ar: "رقم الحساب", en: "Account number" },
  pay_upload: { ar: "رفع إيصال الدفع", en: "Upload payment screenshot" },
  pay_status: { ar: "حالة الدفع", en: "Payment status" },
  status_pending: { ar: "قيد المراجعة", en: "Pending" },
  status_delivered: { ar: "تم التسليم", en: "Delivered" },
  status_rejected: { ar: "مرفوض", en: "Rejected" },
  order_placed: { ar: "تم استلام طلبك", en: "Order received" },
  order_placed_desc: {
    ar: "سيتم مراجعة طلبك من قبل الإدارة وتحديث الحالة قريباً.",
    en: "Your request is pending admin review and will be updated shortly.",
  },
  email: { ar: "البريد الإلكتروني", en: "Email" },
  password: { ar: "كلمة المرور", en: "Password" },
  full_name: { ar: "الاسم الكامل", en: "Full name" },
  phone: { ar: "رقم الجوال", en: "Phone" },
  forgot: { ar: "نسيت كلمة المرور؟", en: "Forgot password?" },
  no_account: { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  have_account: { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
  request_title: { ar: "اطلب مسلسلاً جديداً", en: "Request a new series" },
  request_desc: { ar: "ساعدنا في تطوير المكتبة عبر اقتراح مسلسلاتك المفضلة.", en: "Help us grow the library by suggesting your favourite series." },
  send: { ar: "إرسال", en: "Send" },
  rating_label: { ar: "تقييمك", en: "Your rating" },
  write_review: { ar: "اكتب مراجعة", en: "Write a review" },
  footer_about: { ar: "موڤانا هي وجهتك الأولى لاكتشاف وطلب أفضل المسلسلات العالمية بالعملة المحلية.", en: "Movana is your premier destination to discover and order the best world series in your local currency." },
  yer: { ar: "ر.ي", en: "YER" },
  qty: { ar: "العدد", en: "Qty" },
  continue_shopping: { ar: "متابعة التصفح", en: "Continue browsing" },
  go_home: { ar: "الذهاب للرئيسية", en: "Go home" },
  view_orders: { ar: "عرض طلباتي", en: "View my orders" },
  admin_dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  admin_series: { ar: "المسلسلات", en: "Series" },
  admin_orders: { ar: "الطلبات", en: "Orders" },
  admin_payments: { ar: "المدفوعات", en: "Payments" },
  admin_requests: { ar: "طلبات المستخدمين", en: "User Requests" },
  admin_slides: { ar: "السلايدر", en: "Slides" },
  total_users: { ar: "إجمالي المستخدمين", en: "Total Users" },
  total_orders: { ar: "إجمالي الطلبات", en: "Total Orders" },
  total_series: { ar: "إجمالي المسلسلات", en: "Total Series" },
  revenue: { ar: "الإيرادات", en: "Revenue" },
  add: { ar: "إضافة", en: "Add" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  confirm: { ar: "تأكيد", en: "Confirm" },
  confirm_delete: { ar: "هل أنت متأكد من الحذف؟", en: "Are you sure you want to delete?" },
  search: { ar: "بحث", en: "Search" },
  category: { ar: "الفئة", en: "Category" },
  title_ar: { ar: "العنوان (عربي)", en: "Title (Arabic)" },
  title_en: { ar: "العنوان (إنجليزي)", en: "Title (English)" },
  desc_ar: { ar: "الوصف (عربي)", en: "Description (Arabic)" },
  desc_en: { ar: "الوصف (إنجليزي)", en: "Description (English)" },
  genres_ar: { ar: "الأنواع (عربي)", en: "Genres (Arabic)" },
  genres_en: { ar: "الأنواع (إنجليزي)", en: "Genres (English)" },
  price: { ar: "السعر", en: "Price" },
  source: { ar: "المصدر", en: "Source" },
  trailer_url: { ar: "رابط الإعلان", en: "Trailer URL" },
  poster_color: { ar: "لون البوستر", en: "Poster gradient" },
  flag_trending: { ar: "رائج", en: "Trending" },
  flag_new: { ar: "جديد", en: "New" },
  flag_top: { ar: "الأكثر مشاهدة", en: "Top Watched" },
  flag_featured: { ar: "مميز", en: "Featured" },
  approve: { ar: "موافقة", en: "Approve" },
  reject: { ar: "رفض", en: "Reject" },
  pending: { ar: "قيد المراجعة", en: "Pending" },
  active: { ar: "مفعّل", en: "Active" },
  customer: { ar: "العميل", en: "Customer" },
  receipt: { ar: "الإيصال", en: "Receipt" },
  no_data: { ar: "لا توجد بيانات", en: "No data" },
  add_series: { ar: "إضافة مسلسل", en: "New series" },
  add_slide: { ar: "إضافة سلايد", en: "New slide" },
  subtitle: { ar: "الوصف الفرعي", en: "Subtitle" },
  link_to_series: { ar: "ربط بمسلسل", en: "Link to series" },
  none: { ar: "بدون", en: "None" },
  move_up: { ar: "أعلى", en: "Move up" },
  move_down: { ar: "أسفل", en: "Move down" },
  request_status: { ar: "حالة الطلب", en: "Status" },
  status_open: { ar: "مفتوح", en: "Open" },
  status_approved: { ar: "مقبول", en: "Approved" },
};

interface I18nCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: (key: keyof typeof dict) => string;
  setLang: (l: Lang) => void;
  toggle: () => void;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("movana_lang")) as Lang | null;
    if (saved) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem("movana_lang", lang);
  }, [lang]);

  const value: I18nCtx = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: (k) => dict[k]?.[lang] ?? String(k),
    setLang: setLangState,
    toggle: () => setLangState((l) => (l === "ar" ? "en" : "ar")),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useI18n must be used within I18nProvider");
  return c;
}

export const formatYER = (n: number, lang: Lang) => {
  const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-YE" : "en-US").format(n);
  return lang === "ar" ? `${formatted} ر.ي` : `${formatted} YER`;
};
