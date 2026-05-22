export type Category = "korean" | "turkish" | "english" | "netflix" | "appletv";

export interface Series {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: Category;
  genres: { ar: string; en: string }[];
  year: number;
  imdb: number;
  seasons: number;
  episodes: number;
  sizeGb: number;
  source: string;
  posterColor: string; // gradient seed (fallback)
  posterImage?: string;
  backgroundImage?: string;
  trailerUrl: string;
  price: number; // YER
  trending?: boolean;
  isNew?: boolean;
  topWatched?: boolean;
  featured?: boolean;
  relatedIds?: string[];
}

const g = (ar: string, en: string) => ({ ar, en });

const colors = [
  "from-rose-700 via-red-900 to-zinc-950",
  "from-amber-700 via-rose-900 to-zinc-950",
  "from-violet-700 via-fuchsia-900 to-zinc-950",
  "from-sky-700 via-indigo-900 to-zinc-950",
  "from-emerald-700 via-teal-900 to-zinc-950",
  "from-orange-700 via-red-950 to-zinc-950",
  "from-pink-700 via-rose-950 to-zinc-950",
  "from-cyan-700 via-blue-950 to-zinc-950",
  "from-yellow-700 via-amber-950 to-zinc-950",
  "from-slate-700 via-zinc-900 to-black",
];

const make = (
  id: string,
  titleAr: string,
  titleEn: string,
  category: Category,
  year: number,
  imdb: number,
  seasons: number,
  episodes: number,
  price: number,
  flags: Partial<Pick<Series, "trending" | "isNew" | "topWatched" | "featured">> = {},
  genres: { ar: string; en: string }[] = [g("دراما", "Drama")],
  descAr = "قصة آسرة مليئة بالمشاعر والمفاجآت تجذبك من الحلقة الأولى إلى النهاية.",
  descEn = "A gripping story full of emotion and unexpected turns that hooks you from the first episode."
): Series => ({
  id,
  slug: id,
  title: { ar: titleAr, en: titleEn },
  description: { ar: descAr, en: descEn },
  category,
  genres,
  year,
  imdb,
  seasons,
  episodes,
  source: category === "netflix" ? "Netflix" : category === "appletv" ? "Apple TV+" : "Original",
  posterColor: colors[parseInt(id, 36) % colors.length] ?? colors[0],
  trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  price,
  ...flags,
});

export const series: Series[] = [
  // Korean
  make("k1", "لعبة الحبار", "Squid Game", "korean", 2021, 8.0, 2, 16, 4500, { featured: true, trending: true, topWatched: true }, [g("إثارة", "Thriller"), g("دراما", "Drama")]),
  make("k2", "إشارة العشاق", "Crash Landing on You", "korean", 2020, 8.7, 1, 16, 3500, { topWatched: true }, [g("رومانسي", "Romance")]),
  make("k3", "الطبيب الغريب", "Doctor Strange", "korean", 2023, 8.1, 1, 12, 3200, { isNew: true }),
  make("k4", "وكيل المملكة", "Kingdom", "korean", 2019, 8.3, 2, 12, 3000, { trending: true }, [g("رعب", "Horror")]),
  make("k5", "موسم الأزهار", "Hometown Cha-Cha-Cha", "korean", 2021, 8.5, 1, 16, 2800, {}, [g("رومانسي", "Romance")]),
  make("k6", "كل ما نعرفه", "All of Us Are Dead", "korean", 2022, 7.5, 1, 12, 3100, { trending: true }),
  make("k7", "الوحش", "Beyond Evil", "korean", 2021, 8.7, 1, 16, 2900),
  make("k8", "الإيتر", "Itaewon Class", "korean", 2020, 8.1, 1, 16, 2700, { topWatched: true }),
  // Turkish
  make("t1", "حريم السلطان", "Magnificent Century", "turkish", 2011, 7.9, 4, 139, 5500, { featured: true, topWatched: true }, [g("تاريخي", "Historical")]),
  make("t2", "العشق الأسود", "Kara Sevda", "turkish", 2015, 8.1, 2, 74, 3800, { topWatched: true }, [g("رومانسي", "Romance")]),
  make("t3", "وادي الذئاب", "Valley of the Wolves", "turkish", 2003, 7.8, 10, 200, 4200, {}, [g("أكشن", "Action")]),
  make("t4", "قيامة أرطغرل", "Resurrection: Ertugrul", "turkish", 2014, 8.0, 5, 179, 5000, { trending: true }, [g("تاريخي", "Historical")]),
  make("t5", "العنبر", "Çukur", "turkish", 2017, 8.4, 4, 129, 3600),
  make("t6", "كرة من نار", "Sen Çal Kapımı", "turkish", 2020, 7.6, 2, 52, 2900, { isNew: true }),
  make("t7", "أبناء الحياة", "Hayat Şarkısı", "turkish", 2016, 7.2, 2, 80, 2600),
  make("t8", "بنات الشمس", "Güneşin Kızları", "turkish", 2015, 7.0, 2, 60, 2400),
  // English
  make("e1", "بريكينغ باد", "Breaking Bad", "english", 2008, 9.5, 5, 62, 6000, { featured: true, topWatched: true }, [g("جريمة", "Crime")]),
  make("e2", "اللعبة الأخيرة", "Game of Thrones", "english", 2011, 9.2, 8, 73, 5800, { topWatched: true }, [g("فانتازيا", "Fantasy")]),
  make("e3", "الأشياء الغريبة", "Stranger Things", "english", 2016, 8.7, 4, 34, 4500, { trending: true, isNew: true }, [g("خيال علمي", "Sci-Fi")]),
  make("e4", "وانداكليف", "Wandavision", "english", 2021, 7.9, 1, 9, 3000, {}, [g("خارق", "Superhero")]),
  make("e5", "الوريث", "Succession", "english", 2018, 8.9, 4, 39, 4200, { topWatched: true }),
  make("e6", "تاج", "The Crown", "english", 2016, 8.7, 6, 60, 4400, {}, [g("تاريخي", "Historical")]),
  make("e7", "بيكي بلايندرز", "Peaky Blinders", "english", 2013, 8.8, 6, 36, 4000, { trending: true }),
  make("e8", "ذا بير", "The Bear", "english", 2022, 8.6, 3, 28, 3500, { isNew: true }, [g("كوميديا", "Comedy")]),
];

export const findSeries = (id: string) => series.find((s) => s.id === id);
export const byCategory = (c: Category) => series.filter((s) => s.category === c);
export const trending = () => series.filter((s) => s.trending);
export const newest = () => series.filter((s) => s.isNew);
export const topWatched = () => series.filter((s) => s.topWatched);
export const featured = () => series.filter((s) => s.featured);

export const categoryMeta: Record<Category, { ar: string; en: string }> = {
  korean: { ar: "مسلسلات كورية", en: "Korean Series" },
  turkish: { ar: "مسلسلات تركية", en: "Turkish Series" },
  english: { ar: "مسلسلات أجنبية", en: "English Series" },
  netflix: { ar: "نتفليكس", en: "Netflix" },
  appletv: { ar: "آبل تي في+", en: "Apple TV+" },
};
