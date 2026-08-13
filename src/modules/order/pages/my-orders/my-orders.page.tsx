import { Heading } from "@/shared/components";
import { LabelStatus } from "@/shared/components/common";
import { OrderStatus, orderStatuses } from "@/shared/constants/order.constants";
import { formatDate, formatThoundsand } from "@/shared/utils";
import Link from "next/link";
import { fetchMyOrders } from "../../actions";

export interface MyOrdersPageProps {}

export async function MyOrdersPage(_props: MyOrdersPageProps) {
  const orders = await fetchMyOrders();

  if (!orders?.length)
    return (
      <div className="flex flex-col gap-5">
        <Heading>Đơn hàng của tôi</Heading>
        <div className="bgDarkMode borderDarkMode rounded-xl p-5 font-medium">
          Bạn chưa có đơn hàng nào.{" "}
          <Link href="/explore" className="text-primary underline">
            Xem danh sách khóa học
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <Heading>Đơn hàng của tôi</Heading>
      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const isPending = order.status === OrderStatus.Pending;
          const orderUrl = isPending
            ? `/order/${order.code}`
            : `/course/${order.course?.slug || ""}`;

          return (
            <Link
              key={order._id}
              href={orderUrl}
              className="bgDarkMode borderDarkMode rounded-xl p-4 flex flex-col lg:flex-row lg:items-center gap-3 hover:border-primary transition-colors"
            >
              <div className="flex-1">
                <div className="font-bold">
                  {order.course?.title || "Đơn hàng"}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  <span>{order.code}</span>
                  <span> · </span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <div className="font-bold shrink-0">
                {formatThoundsand(order.total)} VNĐ
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <LabelStatus className={orderStatuses[order.status]?.className}>
                  {orderStatuses[order.status]?.text}
                </LabelStatus>
                {isPending && (
                  <span className="text-sm font-semibold text-primary">
                    Thanh toán ngay
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
