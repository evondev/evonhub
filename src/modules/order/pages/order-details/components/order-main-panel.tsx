import { Button } from "@/components/ui/button";
import {
  CircleX,
  Hourglass,
  MessageCircle,
  TimerOff,
  UserX,
} from "lucide-react";
import Link from "next/link";
import {
  ORDER_SUPPORT_NAME,
  ORDER_SUPPORT_URL,
} from "../../../constants/order-details.constants";
import { OrderDetailsData, OrderDetailsKind } from "../../../types";
import { OrderManualPaymentCard } from "./order-manual-payment-card";
import { OrderPaidPanel } from "./order-paid-panel";
import { OrderSepayPaymentCard } from "./order-sepay-payment-card";
import { OrderStatusPanel } from "./order-status-panel";
import { PayeeContactButtons } from "./payee-contact-buttons";

interface OrderMainPanelProps {
  order: OrderDetailsData;
  kind: OrderDetailsKind;
  now: Date;
  isJustPaid?: boolean;
  isPreview?: boolean;
}

/** Khối chính của trang: việc khách cần làm tiếp với đơn này */
export function OrderMainPanel({
  order,
  kind,
  now,
  isJustPaid,
  isPreview,
}: OrderMainPanelProps) {
  const supportButton = (
    <Button asChild variant="outline">
      <a href={ORDER_SUPPORT_URL} target="_blank" rel="noreferrer">
        <MessageCircle aria-hidden className="size-4 shrink-0" />
        Nhắn {ORDER_SUPPORT_NAME}
      </a>
    </Button>
  );

  if (kind === "sepay-pending") {
    return <OrderSepayPaymentCard order={order} now={now} />;
  }

  if (kind === "manual-pending" && order.payee) {
    return (
      <OrderManualPaymentCard order={order} payee={order.payee} now={now} />
    );
  }

  if (kind === "paid") {
    return (
      <OrderPaidPanel
        order={order}
        isJustPaid={isJustPaid}
        shouldRedirect={!isPreview}
      />
    );
  }

  if (kind === "free-pending") {
    return (
      <OrderStatusPanel
        icon={Hourglass}
        tone="warning"
        title="Đang chờ kích hoạt"
        description="Khóa này miễn phí nên bạn không cần chuyển khoản. Trang tự cập nhật khi đơn được duyệt."
      />
    );
  }

  if (kind === "rejected") {
    return (
      <OrderStatusPanel
        icon={CircleX}
        tone="error"
        title="Đơn bị từ chối"
        description={`Nếu bạn đã chuyển khoản cho đơn này, nhắn ${ORDER_SUPPORT_NAME} kèm ảnh giao dịch để được kiểm tra.`}
        actions={supportButton}
      />
    );
  }

  if (kind === "manual-expired") {
    const payeeName = order.payee?.name || "chuyên gia";

    return (
      <OrderStatusPanel
        icon={TimerOff}
        tone="neutral"
        title="Đơn đã hết hạn"
        description={`Đơn chỉ giữ 24 giờ. Nếu bạn đã chuyển khoản cho ${payeeName}, gửi ảnh giao dịch kèm mã ${order.code} để chuyên gia vẫn duyệt đơn này. Chưa chuyển thì đừng chuyển nữa, hãy đặt lại khóa.`}
        actions={
          <>
            {order.payee ? (
              <PayeeContactButtons payee={order.payee} orderCode={order.code} />
            ) : (
              supportButton
            )}
            {order.course && (
              <Button asChild variant="primary">
                <Link href={`/course/${order.course.slug}`}>
                  Đặt lại khóa này
                </Link>
              </Button>
            )}
          </>
        }
      />
    );
  }

  if (kind === "expired") {
    return (
      <OrderStatusPanel
        icon={TimerOff}
        tone="neutral"
        title="Đơn đã hết hạn"
        description={`Đơn chỉ giữ 24 giờ nên mã ${order.code} không còn nhận tiền. Đừng chuyển khoản vào mã này, hãy đặt lại khóa để có mã mới.`}
        actions={
          order.course && (
            <Button asChild variant="primary">
              <Link href={`/course/${order.course.slug}`}>
                Đặt lại khóa này
              </Link>
            </Button>
          )
        }
      />
    );
  }

  return (
    <OrderStatusPanel
      icon={UserX}
      tone="warning"
      title="Chuyên gia chưa có tài khoản nhận tiền"
      description={`Chuyên gia của khóa này đã gỡ thông tin ngân hàng nên bạn chưa chuyển khoản được. Đừng chuyển vào tài khoản nào khác, nhắn ${ORDER_SUPPORT_NAME} để được hỗ trợ.`}
      actions={supportButton}
    />
  );
}
