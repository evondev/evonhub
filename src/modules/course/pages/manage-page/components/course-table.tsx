import { TablePagination } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import {
  CourseManageFilters,
  CourseManageResult,
} from "../../../types/course-manage.types";
import { CourseListItem } from "./course-list-item";
import { CourseTableEmpty } from "./course-table-empty";
import { CourseTableHead } from "./course-table-head";
import { CourseTableRow } from "./course-table-row";

interface CourseTableProps {
  id: string;
  result: CourseManageResult;
  filters: CourseManageFilters;
  pageSize: number;
  /** Đang tải trang hoặc bộ lọc mới, vẫn giữ dòng cũ trên màn */
  isRefreshing: boolean;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

/** Từ sm là bảng; dưới sm mỗi khóa học một dòng */
export function CourseTable({
  id,
  result,
  filters,
  pageSize,
  isRefreshing,
  onPageChange,
  onClearFilters,
}: CourseTableProps) {
  const hasCourses = result.courses.length > 0;
  const bodyClassName = cn("transition-opacity", isRefreshing && "opacity-60");

  return (
    <section
      id={id}
      aria-label="Danh sách khóa học"
      aria-busy={isRefreshing}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <table className="hidden w-full text-sm sm:table">
        <CourseTableHead />
        <tbody className={bodyClassName}>
          {result.courses.map((course) => (
            <CourseTableRow key={course.id} course={course} />
          ))}
          {!hasCourses && (
            <tr>
              <td colSpan={6}>
                <CourseTableEmpty
                  filters={filters}
                  onClearFilters={onClearFilters}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="sm:hidden">
        {hasCourses && (
          <ul className={bodyClassName}>
            {result.courses.map((course) => (
              <CourseListItem key={course.id} course={course} />
            ))}
          </ul>
        )}
        {!hasCourses && (
          <CourseTableEmpty filters={filters} onClearFilters={onClearFilters} />
        )}
      </div>
      {hasCourses && (
        <TablePagination
          page={filters.page}
          pageSize={pageSize}
          total={result.total}
          itemLabel="khóa học"
          onPageChange={onPageChange}
        />
      )}
    </section>
  );
}
