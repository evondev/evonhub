import PageNotFound from "@/app/not-found";
import { OrderDetailsPage } from "@/modules/order/pages/order-details";

export interface OrderDetailsPageRootProps {
  params: {
    orderId: string;
  };
  searchParams: {
    paid?: string;
  };
}

export default function OrderDetailsPageRoot({
  params,
  searchParams,
}: OrderDetailsPageRootProps) {
  if (!params.orderId) return <PageNotFound />;

  return (
    <OrderDetailsPage
      orderCode={params.orderId}
      isJustPaid={searchParams?.paid === "1"}
    />
  );
}
