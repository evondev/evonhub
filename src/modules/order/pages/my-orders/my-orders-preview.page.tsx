import { PreviewStateSwitcher } from "@/shared/components/common";
import { MY_ORDERS_PREVIEW_STATE_LINKS } from "../../constants";
import { MyOrdersPreviewState } from "../../types";
import { buildPreviewMyOrders } from "../../utils";
import {
  MyOrdersLoadError,
  MyOrdersSkeleton,
  MyOrdersView,
} from "./components";

interface MyOrdersPreviewPageProps {
  state: MyOrdersPreviewState;
}

/** Trang xem trước "Đơn hàng của tôi" bằng đơn giả. Không đọc DB, chỉ mở ở dev */
export function MyOrdersPreviewPage({ state }: MyOrdersPreviewPageProps) {
  const referenceTime = Date.now();
  const isDataState = state !== "dang-tai" && state !== "loi";

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={MY_ORDERS_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      {state === "dang-tai" && <MyOrdersSkeleton />}
      {state === "loi" && <MyOrdersLoadError />}
      {isDataState && (
        <MyOrdersView
          orders={buildPreviewMyOrders(state, new Date(referenceTime))}
          referenceTime={referenceTime}
        />
      )}
    </div>
  );
}
