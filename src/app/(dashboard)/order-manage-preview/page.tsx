import { ORDER_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/order/constants/order-manage.constants";
import { OrderManagePreviewPage } from "@/modules/order/pages";
import { OrderManagePreviewState } from "@/modules/order/types/order-manage.types";
import { notFound } from "next/navigation";

interface OrderManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function OrderManagePreviewRoute({
  searchParams,
}: OrderManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = ORDER_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: OrderManagePreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return (
    <OrderManagePreviewPage
      key={state}
      state={state}
      referenceTime={Date.now()}
    />
  );
}
