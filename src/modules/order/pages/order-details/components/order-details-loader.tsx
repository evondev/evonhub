import PageNotFound from "@/app/not-found";
import { getOrderDetails } from "@/lib/actions/order.action";
import { OrderDetailsView } from "./order-details-view";

interface OrderDetailsLoaderProps {
  orderCode: string;
  isJustPaid?: boolean;
}

export async function OrderDetailsLoader({
  orderCode,
  isJustPaid,
}: OrderDetailsLoaderProps) {
  const order = await getOrderDetails(orderCode);

  if (!order) return <PageNotFound />;

  return (
    <OrderDetailsView
      order={order}
      referenceTime={Date.now()}
      isJustPaid={isJustPaid}
    />
  );
}
