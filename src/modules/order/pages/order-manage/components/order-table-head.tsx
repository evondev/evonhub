import { cn } from "@/shared/utils";

const headCellClassName = "h-11 px-4 text-xs font-medium text-muted";

/**
 * Bề rộng cột và hàng tiêu đề, dùng chung cho bảng thật và khung chờ để lúc
 * dữ liệu về cột không xê dịch. Cột mã, trạng thái, số tiền, thao tác rộng cố
 * định; học viên và khoá học chia phần còn lại
 */
export function OrderTableHead() {
  return (
    <>
      <colgroup>
        <col className="w-[132px]" />
        <col />
        <col />
        <col className="w-[160px]" />
        <col className="w-[124px]" />
        <col className="w-[152px]" />
      </colgroup>
      <thead>
        <tr className="border-b border-border">
          <th scope="col" className={cn(headCellClassName, "pl-5")}>
            Đơn hàng
          </th>
          <th scope="col" className={headCellClassName}>
            Học viên
          </th>
          <th scope="col" className={headCellClassName}>
            Khoá học
          </th>
          <th scope="col" className={headCellClassName}>
            Trạng thái
          </th>
          <th scope="col" className={cn(headCellClassName, "text-right")}>
            Số tiền
          </th>
          <th scope="col" className={cn(headCellClassName, "pl-2 pr-5")}>
            <span className="sr-only">Thao tác</span>
          </th>
        </tr>
      </thead>
    </>
  );
}
