"use client";

import { Button } from "@/components/ui/button";
import Fireworks from "@/shared/components/common/fireworks";
import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ORDER_PAID_REDIRECT_SECONDS } from "../../../constants/order-details.constants";
import { OrderDetailsData } from "../../../types";
import {
  getOrderPaidDescription,
  getOrderStudyHref,
} from "../../../utils/order-details.utils";
import { OrderStatusPanel } from "./order-status-panel";

interface OrderPaidPanelProps {
  order: OrderDetailsData;
  /** Khách vừa trả tiền xong ngay trong phiên này: bắn pháo hoa, đếm ngược */
  isJustPaid?: boolean;
  /** Trang xem trước không tự chuyển trang */
  shouldRedirect?: boolean;
}

export function OrderPaidPanel({
  order,
  isJustPaid,
  shouldRedirect = true,
}: OrderPaidPanelProps) {
  const router = useRouter();
  const studyHref = getOrderStudyHref(order);
  const [remainingSeconds, setRemainingSeconds] = useState(
    ORDER_PAID_REDIRECT_SECONDS,
  );
  const isCountingDown = Boolean(isJustPaid && shouldRedirect);

  useEffect(() => {
    if (!isCountingDown) return;

    if (remainingSeconds <= 0) {
      router.push(studyHref);
      return;
    }

    const countdownTimer = setTimeout(
      () => setRemainingSeconds((current) => current - 1),
      1000,
    );

    return () => clearTimeout(countdownTimer);
  }, [isCountingDown, remainingSeconds, router, studyHref]);

  return (
    <>
      {isJustPaid && <Fireworks className="fixed inset-0 z-50" />}
      <OrderStatusPanel
        icon={CircleCheck}
        tone="success"
        title={isJustPaid ? "Thanh toán thành công" : "Đơn đã thanh toán"}
        description={
          <>
            {getOrderPaidDescription(order, isJustPaid)}
            {isCountingDown &&
              ` Tự chuyển tới khu học tập sau ${remainingSeconds} giây.`}
          </>
        }
        actions={
          <Button asChild variant="primary">
            <Link href={studyHref}>Vào học ngay</Link>
          </Button>
        }
      />
    </>
  );
}
