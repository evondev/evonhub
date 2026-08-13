"use client";

import { OrderStatus } from "@/shared/constants/order.constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryOrderStatus } from "../../../services/data/query-order-status.data";

export interface OrderPaymentWatcherProps {
  code: string;
}

/**
 * Hỏi lại trạng thái đơn hàng mỗi 5 giây. Khi webhook SePay duyệt đơn thì
 * refresh để server component render lại màn hình thành công.
 */
export function OrderPaymentWatcher({ code }: OrderPaymentWatcherProps) {
  const router = useRouter();
  const { data: status } = useQueryOrderStatus({ code });

  useEffect(() => {
    if (status === OrderStatus.Approved) {
      router.refresh();
    }
  }, [status, router]);

  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <span className="size-2 rounded-full bg-primary animate-pulse" />
      <span>Hệ thống đang chờ xác nhận chuyển khoản tự động...</span>
    </div>
  );
}
