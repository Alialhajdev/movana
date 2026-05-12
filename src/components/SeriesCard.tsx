import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Series } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Props {
  series: Series;
  className?: string;
}

export function SeriesCard({ series, className }: Props) {
  const { lang, t } = useI18n();
  const { isFavorite, toggleFavorite } = useStore();
  const fav = isFavorite(series.id);

  return (
    <Link
      to={`/series/${series.id}`}
      className={cn("group relative block w-[180px] sm:w-[210px] md:w-[230px] shrink-0 card-hover", className)}
    >
      <div className={cn("relative aspect-[2/3] overflow-hidden rounded-lg bg-gradient-to-br shadow-card", series.posterColor)}>
        <div className="absolute inset-0 flex flex-col justify-end p-3 bg-gradient-to-t from-black/95 via-black/30 to-transparent">
          <h3 className="font-display text-lg leading-tight text-white text-shadow-hero line-clamp-2">{series.title[lang]}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1 text-[var(--gold)]">
              <Star className="size-3 fill-current" /> {series.imdb}
            </span>
            <span>•</span>
            <span>{series.year}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggleFavorite(series.id); }}
          aria-label={t("hero_add_fav")}
          className="absolute top-2 end-2 grid size-9 place-items-center rounded-full bg-black/60 backdrop-blur opacity-0 group-hover:opacity-100 transition hover:bg-primary"
        >
          <Heart className={cn("size-4", fav && "fill-primary text-primary")} />
        </button>
        {series.isNew && (
          <span className="absolute top-2 start-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">New</span>
        )}
      </div>
    </Link>
  );
}
