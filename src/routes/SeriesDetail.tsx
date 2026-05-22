import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Heart, Play, Share2, ShoppingCart, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Header, Footer, MobileBottomNav } from "@/components/Layout";
import { SeriesRow } from "@/components/SeriesRow";
import { categoryMeta } from "@/lib/data";
import { formatYER, useI18n } from "@/lib/i18n";
import { useStore, type Review } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function SeriesDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const {
    addToCart, toggleFavorite, isFavorite, findSeries, series: allSeries,
    user, fetchReviews, addReview, deleteReview,
  } = useStore();
  const s = findSeries(id);
  const [items, setItems] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  // Scroll to top whenever the series changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  // Load reviews
  useEffect(() => {
    if (!id) return;
    fetchReviews(id).then(setItems);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const related = useMemo(() => {
    if (!s) return [];
    if (s.relatedIds && s.relatedIds.length) {
      return s.relatedIds.map((rid) => allSeries.find((x) => x.id === rid)).filter(Boolean) as typeof allSeries;
    }
    return allSeries.filter((x) => x.category === s.category && x.id !== s.id);
  }, [s, allSeries]);

  if (!s) {
    return (
      <>
        <Header />
        <main className="pt-32 pb-24 mx-auto max-w-[1600px] px-4 md:px-10 text-center text-muted-foreground">
          {lang === "ar" ? "المسلسل غير موجود" : "Series not found"}
        </main>
        <Footer />
      </>
    );
  }
  const fav = isFavorite(s.id);

  const share = () => {
    if (navigator.share) navigator.share({ title: s.title[lang], url: window.location.href }).catch(() => {});
    else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  };

  const submitReview = async () => {
    if (!user) { toast.error(lang === "ar" ? "سجّل الدخول لإضافة مراجعة" : "Sign in to add a review"); return; }
    if (!comment.trim()) { toast.error(lang === "ar" ? "اكتب تعليقاً" : "Write a comment"); return; }
    setBusy(true);
    const { error } = await addReview(s.id, rating, comment.trim());
    setBusy(false);
    if (error) { toast.error(error); return; }
    setComment(""); setRating(5);
    const list = await fetchReviews(s.id);
    setItems(list);
    toast.success(lang === "ar" ? "تمت إضافة مراجعتك" : "Review added");
  };

  const removeReview = async (rid: string) => {
    await deleteReview(rid);
    setItems((arr) => arr.filter((r) => r.id !== rid));
  };

  const avg = items.length ? items.reduce((a, b) => a + b.rating, 0) / items.length : 0;

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-12">
        <section className="relative min-h-[80vh] w-full overflow-hidden pb-12">
          {s.backgroundImage ? (
            <img src={s.backgroundImage} alt="" className="absolute inset-0 size-full object-cover object-top" />
          ) : (
            <div className={cn("absolute inset-0 bg-gradient-to-br animate-ken-burns", s.posterColor)} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] items-start px-4 md:px-10 pt-[50vh]">
            <div className="max-w-3xl">
              <Link to={`/category/${s.category}`} className="inline-block rounded-full gradient-red px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {categoryMeta[s.category][lang]}
              </Link>
              <h1 className="font-display mt-4 text-5xl md:text-7xl text-white text-shadow-hero">{s.title[lang]}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded bg-[var(--gold)]/15 px-2 py-1 text-[var(--gold)]">
                  <Star className="size-3.5 fill-current" /> IMDb {s.imdb}
                </span>
                <span>{s.year}</span>
                <span>· {s.seasons} {t("seasons")}</span>
                <span>· {s.episodes} {t("episodes")}</span>
                {s.sizeGb > 0 && <span>· {s.sizeGb} {lang === "ar" ? "جيجابايت" : "GB"}</span>}
                <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{s.source}</span>
                {s.genres.map((g) => <span key={g.en} className="rounded bg-white/5 px-2 py-0.5 text-xs">{g[lang]}</span>)}
              </div>
              <p className="mt-5 max-w-2xl text-base md:text-lg text-white/85">{s.description[lang]}</p>
              <div className="mt-3 text-2xl font-bold text-white">{formatYER(s.price, lang)}</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => { addToCart(s.id); toast.success(lang === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart"); }}
                  className="inline-flex items-center gap-2 rounded-md gradient-red px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:opacity-90 transition"
                >
                  <ShoppingCart className="size-4" /> {t("hero_add_cart")}
                </button>
                <button onClick={() => toggleFavorite(s.id)} className="inline-flex items-center gap-2 rounded-md glass px-5 py-3 text-sm font-bold hover:bg-white/10">
                  <Heart className={cn("size-4", fav && "fill-primary text-primary")} /> {t("hero_add_fav")}
                </button>
                <button onClick={share} className="grid size-12 place-items-center rounded-full glass hover:bg-white/10">
                  <Share2 className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-12">
          <h2 className="font-display text-3xl mb-4 flex items-center gap-2"><Play className="size-6 text-primary fill-current" /> {t("trailer")}</h2>
          <div className="aspect-video w-full overflow-hidden rounded-xl shadow-card">
            <iframe src={s.trailerUrl} title="trailer" className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 md:px-10 mt-12">
          <div className="flex items-end justify-between gap-3 flex-wrap">
            <h2 className="font-display text-3xl">{t("reviews")}</h2>
            {items.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {avg.toFixed(1)} <Star className="inline size-3.5 fill-[var(--gold)] text-[var(--gold)]" /> · {items.length}
              </span>
            )}
          </div>
          <div className="mt-4 glass rounded-2xl p-6 space-y-4">
            {/* Add review form */}
            {user ? (
              <div className="border-b border-border pb-4">
                <p className="text-sm font-medium mb-2">{t("write_review")}</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
                      <Star className={cn("size-5", n <= rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground")} />
                    </button>
                  ))}
                </div>
                <Textarea rows={3} placeholder={lang === "ar" ? "شاركنا رأيك..." : "Share your thoughts..."} value={comment} onChange={(e) => setComment(e.target.value)} />
                <Button onClick={submitReview} disabled={busy} className="gradient-red text-primary-foreground mt-2">
                  {t("send")}
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground border-b border-border pb-4">
                {lang === "ar" ? "سجّل الدخول لكتابة مراجعة" : "Sign in to write a review"} · <Link to="/login" className="text-primary">{t("nav_login")}</Link>
              </p>
            )}

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{lang === "ar" ? "لا توجد مراجعات بعد" : "No reviews yet"}</p>
            ) : items.map((rev) => (
              <div key={rev.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{rev.userName || (lang === "ar" ? "مستخدم" : "User")}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex text-[var(--gold)]">
                      {Array.from({ length: rev.rating }).map((_, idx) => <Star key={idx} className="size-4 fill-current" />)}
                    </span>
                    {user && (user.id === rev.userId || user.isAdmin) && (
                      <button onClick={() => removeReview(rev.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>

        <SeriesRow title={t("related")} items={related} />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
