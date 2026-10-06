import { PreviewStateSwitcher } from "@/shared/components/common";
import { ORDER_DETAILS_PREVIEW_STATE_LINKS } from "../../constants/order-details.constants";
import { OrderDetailsPreviewState } from "../../types";
import { buildPreviewOrderDetails } from "../../utils/order-details.utils";
import { OrderDetailsSkeleton, OrderDetailsView } from "./components";

interface OrderDetailsPreviewPageProps {
  state: OrderDetailsPreviewState;
}

/** Trang xem trước chi tiết đơn bằng đơn giả, mỗi trạng thái một đơn. Chỉ mở ở dev */
export function OrderDetailsPreviewPage({
  state,
}: OrderDetailsPreviewPageProps) {
  const referenceTime = Date.now();
  const preview = buildPreviewOrderDetails(state, new Date(referenceTime));

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={ORDER_DETAILS_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      {!preview && <OrderDetailsSkeleton />}
      {preview && (
        <OrderDetailsView
          order={preview.order}
          referenceTime={referenceTime}
          isJustPaid={preview.isJustPaid}
          isPreview
        />
      )}
    </div>
  );
}
