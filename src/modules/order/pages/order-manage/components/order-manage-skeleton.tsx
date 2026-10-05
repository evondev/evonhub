import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import { ORDER_MANAGE_SKELETON_ROW_COUNT } from "../../../constants/order-manage.constants";
import { OrderTableHead } from "./order-table-head";

const skeletonRows = Array.from(
  { length: ORDER_MANAGE_SKELETON_ROW_COUNT },
  (_, index) => index,
);

const bodyCellClassName = "px-4 py-3.5 align-top";

/** Khung chờ đúng hình bảng (từ xl) và danh sách (hẹp hơn) */
export function OrderManageSkeleton() {
  return (
    <div
      aria-busy="true"
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <table className="hidden w-full table-fixed text-left xl:table">
        <OrderTableHead />
        <tbody>
          {skeletonRows.map((rowIndex) => (
            <tr key={rowIndex} className="border-b border-border last:border-0">
              <td className={cn(bodyCellClassName, "pl-5")}>
                <div className="flex flex-col gap-2 py-0.5">
                  <Skeleton className="h-3.5 w-24 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
              </td>
              <td className={bodyCellClassName}>
                <div className="flex flex-col gap-2 py-0.5">
                  <Skeleton className="h-3.5 w-3/4 rounded-full" />
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              </td>
              <td className={bodyCellClassName}>
                <Skeleton className="mt-0.5 h-3.5 w-full rounded-full" />
              </td>
              <td className={bodyCellClassName}>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-3 w-20 rounded-full" />
                </div>
              </td>
              <td className={bodyCellClassName}>
                <Skeleton className="ml-auto mt-0.5 h-3.5 w-20 rounded-full" />
              </td>
              <td className="py-3 pl-2 pr-5" />
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="xl:hidden">
        {skeletonRows.map((rowIndex) => (
          <li
            key={rowIndex}
            className="flex flex-col gap-2.5 border-b border-border px-4 py-4 last:border-0 sm:px-5"
          >
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3.5 w-36 rounded-full" />
              <Skeleton className="h-3.5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-4/5 max-w-md rounded-full" />
            <Skeleton className="h-3 w-3/5 max-w-xs rounded-full" />
            <Skeleton className="mt-1 h-5 w-28 rounded-full" />
          </li>
        ))}
      </ul>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
