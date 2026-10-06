import { ORDER_DETAILS_PREVIEW_STATE_LINKS } from "@/modules/order/constants/order-details.constants";
import { OrderDetailsPreviewPage } from "@/modules/order/pages/order-details";
import { OrderDetailsPreviewState } from "@/modules/order/types";
import { notFound } from "next/navigation";

interface OrderPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function OrderPreviewRoute({
  searchParams,
}: OrderPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = ORDER_DETAILS_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: OrderDetailsPreviewState =
    matchedState?.state || "cho-thanh-toan";

  return <OrderDetailsPreviewPage state={state} />;
}
