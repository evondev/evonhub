import { cn } from "@/shared/utils";
import Link from "next/link";
import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { buildExploreHref } from "../../../utils";
import { ExploreSearchInput } from "./explore-search-input";

interface ExploreFilterBarProps {
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

/** Ô tìm và chip lọc, dính dưới header khi cuộn */
export function ExploreFilterBar({ filters, linkBase }: ExploreFilterBarProps) {
  const freeToggleHref = buildExploreHref(linkBase, {
    ...filters,
    isFree: !filters.isFree,
    page: 1,
  });

  return (
    <div className="sticky top-16 z-10 -mx-4 flex flex-col gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:top-20 lg:-mx-4 lg:flex-row lg:items-center lg:px-4">
      <ExploreSearchInput defaultValue={filters.search} />
      <div className="flex gap-2">
        <Link
          href={freeToggleHref}
          scroll={false}
          aria-current={filters.isFree ? "true" : undefined}
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-4 focus-visible:ring-primary/15",
            filters.isFree &&
              "border-primary/40 bg-primary/10 text-primary-strong",
            !filters.isFree &&
              "border-border-strong bg-surface text-foreground/80 hover:bg-foreground/5 hover:text-foreground",
          )}
        >
          Miễn phí
        </Link>
      </div>
    </div>
  );
}
