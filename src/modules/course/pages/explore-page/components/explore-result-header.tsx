import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { ExploreSortMenu } from "./explore-sort-menu";

interface ExploreResultHeaderProps {
  total: number;
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

/** "9 khóa học" và sắp xếp cùng hàng; một khóa thì không có gì để sắp */
export function ExploreResultHeader({
  total,
  filters,
  linkBase,
}: ExploreResultHeaderProps) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-3">
      <p className="text-sm text-muted" aria-live="polite">
        <span className="font-semibold tabular-nums text-foreground">
          {total}
        </span>{" "}
        khóa học
      </p>
      {total > 1 && <ExploreSortMenu filters={filters} linkBase={linkBase} />}
    </div>
  );
}
