import Skeleton from "@/shared/components/skeleton";
import { COURSE_MANAGE_SKELETON_ROW_COUNT } from "../../../constants/course-manage.constants";
import { CourseTableHead } from "./course-table-head";

const skeletonRows = Array.from(
  { length: COURSE_MANAGE_SKELETON_ROW_COUNT },
  (_, index) => index,
);

/** Khung chờ đúng hình bảng: cùng hàng tiêu đề, dòng ảnh bìa + tên */
export function CourseTableSkeleton() {
  return (
    <div
      aria-busy="true"
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <table className="hidden w-full text-sm sm:table">
        <CourseTableHead />
        <tbody>
          {skeletonRows.map((rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-0">
              <td className="w-full max-w-0 py-3 pl-5 pr-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-16 shrink-0 rounded-md" />
                  <Skeleton className="h-3.5 w-72 max-w-full rounded-full" />
                </div>
              </td>
              <td className="w-px px-4 py-3">
                {/* Rộng cỡ badge "Chờ duyệt" */}
                <Skeleton className="h-6 w-24 rounded-full" />
              </td>
              <td className="w-px px-4 py-3">
                <Skeleton className="ml-auto h-3.5 w-20 rounded-full" />
              </td>
              <td className="w-px px-4 py-3">
                <Skeleton className="ml-auto h-3.5 w-10 rounded-full" />
              </td>
              <td className="hidden w-px px-4 py-3 md:table-cell">
                <Skeleton className="h-3.5 w-20 rounded-full" />
              </td>
              <td className="w-px py-3 pl-2 pr-3">
                <div className="size-9" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="sm:hidden">
        {skeletonRows.map((rowIndex) => (
          <li
            key={rowIndex}
            className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0"
          >
            <Skeleton className="h-9 w-16 shrink-0 rounded-md" />
            <div className="flex-1 space-y-2 pt-0.5">
              <Skeleton className="h-3.5 w-48 rounded-full" />
              <Skeleton className="h-3 w-36 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
