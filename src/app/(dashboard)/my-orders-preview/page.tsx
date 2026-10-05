import { MY_ORDERS_PREVIEW_STATE_LINKS } from "@/modules/order/constants";
import { MyOrdersPreviewPage } from "@/modules/order/pages/my-orders";
import { MyOrdersPreviewState } from "@/modules/order/types";
import { notFound } from "next/navigation";

interface MyOrdersPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function MyOrdersPreviewRoute({
  searchParams,
}: MyOrdersPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = MY_ORDERS_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: MyOrdersPreviewState = matchedState?.state || "du-lieu";

  return <MyOrdersPreviewPage state={state} />;
}
