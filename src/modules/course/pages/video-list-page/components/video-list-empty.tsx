import { Button } from "@/components/ui/button";
import { Clapperboard, SearchX, X } from "lucide-react";
import Link from "next/link";

interface VideoListEmptyProps {
  /** Có khi người xem đang lọc: lọc không ra video nào thì cho lối xoá lọc */
  clearFiltersHref?: string;
}

/** Cùng khuôn với khối không có kết quả của trang Khóa học */
export function VideoListEmpty({ clearFiltersHref }: VideoListEmptyProps) {
  const isFiltered = Boolean(clearFiltersHref);

  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-foreground/5 text-muted">
        {isFiltered && <SearchX className="size-6" />}
        {!isFiltered && <Clapperboard className="size-6" />}
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          {isFiltered && "Không có video nào khớp"}
          {!isFiltered && "Chưa có video nào"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isFiltered && "Thử bỏ lọc hoặc tìm bằng từ khác."}
          {!isFiltered && "Video mới sẽ hiện ở đây."}
        </p>
      </div>
      {clearFiltersHref && (
        <Button asChild variant="outline">
          <Link href={clearFiltersHref} scroll={false}>
            <X className="size-4 shrink-0" />
            Xoá bộ lọc
          </Link>
        </Button>
      )}
    </section>
  );
}
