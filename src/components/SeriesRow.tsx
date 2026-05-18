import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Series } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { SeriesCard } from "./SeriesCard";

interface Props {
  title: string;
  items: Series[];
  viewMoreTo?: string;
}

export function SeriesRow({ title, items, viewMoreTo }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { t, dir } = useI18n();

  const scroll = (delta: number) => {
    ref.current?.scrollBy({ left: dir === "rtl" ? -delta : delta, behavior: "smooth" });
  };

  return (
    <section className="relative py-6 md:py-8">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-4 md:px-10">
        <h2 className="font-display text-2xl md:text-3xl text-white">{title}</h2>
        {viewMoreTo && (
          <Link to={viewMoreTo} className="text-sm text-muted-foreground hover:text-primary transition">
            {t("view_more")} ›
          </Link>
        )}
      </div>

      <div className="group/row relative mt-4">
        <button
          aria-label="prev"
          onClick={() => scroll(-600)}
          className="absolute start-2 top-1/2 z-20 -translate-y-1/2 hidden md:grid size-10 place-items-center rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 hover:bg-primary transition"
        >
          {dir === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </button>
        <div
          ref={ref}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 md:px-10 pb-10 pt-2"
        >
          {items.map((s) => (
            <SeriesCard key={s.id} series={s} />
          ))}
        </div>
        <button
          aria-label="next"
          onClick={() => scroll(600)}
          className="absolute end-2 top-1/2 z-20 -translate-y-1/2 hidden md:grid size-10 place-items-center rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 hover:bg-primary transition"
        >
          {dir === "rtl" ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>
    </section>
  );
}
