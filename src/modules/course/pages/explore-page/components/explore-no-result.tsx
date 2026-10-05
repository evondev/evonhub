import { Button } from "@/components/ui/button";
import { SearchX, X } from "lucide-react";
import Link from "next/link";

interface ExploreNoResultProps {
  clearFiltersHref: string;
}

export function ExploreNoResult({ clearFiltersHref }: ExploreNoResultProps) {
  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-foreground/5 text-muted">
        <SearchX className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Không có khóa nào khớp
        </h2>
        <p className="mt-1 text-sm text-muted">
          Thử bỏ bớt bộ lọc hoặc tìm bằng từ khác.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href={clearFiltersHref} scroll={false}>
          <X className="size-4 shrink-0" />
          Xoá bộ lọc
        </Link>
      </Button>
    </section>
  );
}
