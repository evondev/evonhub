import PageNotFound from "@/app/not-found";
import { OrderDetailsPage } from "@/modules/order/pages/order-details";

export interface OrderDetailsPageRootProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPageRoot({
  params,
}: OrderDetailsPageRootProps) {
  if (!params.orderId) return <PageNotFound />;

  return <OrderDetailsPage orderCode={params.orderId} />;
}
