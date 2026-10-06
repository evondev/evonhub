import { cn } from "@/shared/utils";

const headCellClassName =
  "h-11 whitespace-nowrap px-4 text-left text-xs font-medium text-muted";

/** Hàng tiêu đề cột, dùng chung cho bảng thật và khung chờ để cột không nhảy */
export function CourseTableHead() {
  return (
    <thead>
      <tr className="border-b border-border">
        <th scope="col" className={cn(headCellClassName, "pl-5")}>
          Khóa học
        </th>
        <th scope="col" className={headCellClassName}>
          Trạng thái
        </th>
        <th scope="col" className={cn(headCellClassName, "text-right")}>
          Giá
        </th>
        <th scope="col" className={cn(headCellClassName, "text-right")}>
          Học viên
        </th>
        <th
          scope="col"
          className={cn(headCellClassName, "hidden md:table-cell")}
        >
          Ngày tạo
        </th>
        <th scope="col" className="w-px pr-3">
          <span className="sr-only">Thao tác</span>
        </th>
      </tr>
    </thead>
  );
}
