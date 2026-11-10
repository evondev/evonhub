import { TablePagination } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { ACTIVITY_RETENTION_DAYS } from "../../../constants";
import { ActivityManageFilters, ActivityManageResult } from "../../../types";
import { TopLessonListEmpty } from "./top-lesson-list-empty";
import { TopLessonListItem } from "./top-lesson-list-item";

interface TopLessonListProps {
  id: string;
  result: ActivityManageResult;
  filters: ActivityManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

/** Bảng xếp hạng bài học: nhiều người học nhất lên đầu */
export function TopLessonList({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  onPageChange,
  onClearFilters,
}: TopLessonListProps) {
  const hasLessons = result.topLessons.length > 0;

  return (
    <section
      id={id}
      aria-label="Bài học được học nhiều nhất"
      aria-busy={isRefreshing}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      {hasLessons && (
        <>
          <p className="border-b border-border px-4 py-2.5 text-xs text-pretty text-muted sm:px-5">
            Xếp theo số người học khác nhau, hoà thì xét số phiên rồi thời gian.
            Nhật ký chỉ giữ {ACTIVITY_RETENTION_DAYS} ngày gần nhất.
          </p>
          <ol
            className={cn("transition-opacity", isRefreshing && "opacity-60")}
          >
            {result.topLessons.map((lesson) => (
              <TopLessonListItem key={lesson.id} lesson={lesson} />
            ))}
          </ol>
          <TablePagination
            page={filters.page}
            pageSize={pageSize}
            total={result.total}
            itemLabel="bài học"
            onPageChange={onPageChange}
          />
        </>
      )}
      {!hasLessons && (
        <TopLessonListEmpty filters={filters} onClearFilters={onClearFilters} />
      )}
    </section>
  );
}
