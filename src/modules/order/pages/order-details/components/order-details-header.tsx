import { ToneBadge } from "@/shared/components/common/tone-badge";
import Link from "next/link";
import { FREE_ORDER_PAID_LABEL } from "../../../constants";
import { ORDER_DETAILS_BADGES } from "../../../constants/order-details.constants";
import { OrderDetailsData, OrderDetailsKind } from "../../../types";
import { formatOrderDateTime } from "../../../utils/order-details.utils";

interface OrderDetailsHeaderProps {
  order: OrderDetailsData;
  kind: OrderDetailsKind;
}

/** Đường dẫn về danh sách đơn, mã đơn là <h1>, badge trạng thái, giờ đặt */
export function OrderDetailsHeader({ order, kind }: OrderDetailsHeaderProps) {
  const badge = ORDER_DETAILS_BADGES[kind];
  const badgeLabel =
    kind === "paid" && order.total <= 0 ? FREE_ORDER_PAID_LABEL : badge.label;

  return (
    <header>
      <nav aria-label="Đường dẫn">
        <Link
          href="/my-orders"
          className="inline-flex h-8 items-center text-sm text-muted transition-colors hover:text-foreground focus-visible:underline"
        >
          Đơn hàng của tôi
        </Link>
      </nav>
      <h1 className="text-lg font-semibold text-foreground">
        Đơn hàng {order.code}
      </h1>
      {/* Badge đứng cùng hàng giờ đặt: đứng cạnh mã đơn thì ở 375px rớt dòng */}
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <ToneBadge tone={badge.tone} label={badgeLabel} />
        <p className="text-sm text-muted">
          Đặt lúc {formatOrderDateTime(order.createdAt)}
        </p>
      </div>
    </header>
  );
}
