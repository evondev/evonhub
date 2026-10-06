"use client";

import { OrderStatus } from "@/shared/constants/order.constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQueryOrderStatus } from "../../../services/data/query-order-status.data";

export interface OrderPaymentWatcherProps {
  code: string;
}

/**
 * Hỏi lại trạng thái đơn hàng mỗi 5 giây. Khi webhook SePay hay chuyên gia
 * duyệt đơn thì refresh để server component render lại màn hình thành công.
 * Không vẽ gì: dòng "Đang chờ…" nằm trong card thanh toán.
 */
export function OrderPaymentWatcher({ code }: OrderPaymentWatcherProps) {
  const router = useRouter();
  const { data: status } = useQueryOrderStatus({ code });

  useEffect(() => {
    if (status !== OrderStatus.Approved) return;

    // Gắn cờ paid để màn hình thành công biết là khách vừa trả tiền xong,
    // từ đó mới đếm ngược chuyển sang khu vực học tập
    router.replace(`/order/${code}?paid=1`);
    router.refresh();
  }, [status, router, code]);

  return null;
}
