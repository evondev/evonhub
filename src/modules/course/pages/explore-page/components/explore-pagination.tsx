import { cn } from "@/shared/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { buildExploreHref, buildPaginationItems } from "../../../utils";

interface ExplorePaginationProps {
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
  totalPages: number;
}

const pageStepClassName =
  "grid size-9 place-items-center rounded-xl outline-none transition-colors";

export function ExplorePagination({
  filters,
  linkBase,
  totalPages,
}: ExplorePaginationProps) {
  if (totalPages <= 1) return null;

  const getPageHref = (page: number) =>
    buildExploreHref(linkBase, { ...filters, page });
  const hasPreviousPage = filters.page > 1;
  const hasNextPage = filters.page < totalPages;

  return (
    <nav
      aria-label="Phân trang"
      className="flex items-center justify-center gap-1"
    >
      {hasPreviousPage && (
        <Link
          href={getPageHref(filters.page - 1)}
          aria-label="Trang trước"
          className={cn(
            pageStepClassName,
            "text-foreground/80 hover:bg-foreground/5",
          )}
        >
          <ChevronLeft className="size-4" />
        </Link>
      )}
      {!hasPreviousPage && (
        <span
          aria-hidden="true"
          className={cn(pageStepClassName, "text-foreground/30")}
        >
          <ChevronLeft className="size-4" />
        </span>
      )}
      {buildPaginationItems(filters.page, totalPages).map((item, index) => {
        if (item === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="grid size-9 place-items-center text-sm text-muted"
            >
              …
            </span>
          );
        }

        const isCurrent = item === filters.page;

        return (
          <Link
            key={item}
            href={getPageHref(item)}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              pageStepClassName,
              "text-sm tabular-nums",
              isCurrent && "bg-primary/10 font-semibold text-primary-strong",
              !isCurrent && "text-foreground/80 hover:bg-foreground/5",
            )}
          >
            {item}
          </Link>
        );
      })}
      {hasNextPage && (
        <Link
          href={getPageHref(filters.page + 1)}
          aria-label="Trang sau"
          className={cn(
            pageStepClassName,
            "text-foreground/80 hover:bg-foreground/5",
          )}
        >
          <ChevronRight className="size-4" />
        </Link>
      )}
      {!hasNextPage && (
        <span
          aria-hidden="true"
          className={cn(pageStepClassName, "text-foreground/30")}
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
