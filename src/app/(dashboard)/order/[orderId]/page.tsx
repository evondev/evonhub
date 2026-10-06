import { NotFoundState } from "@/shared/components/not-found";
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
  if (!params.orderId) return <NotFoundState />;

  return (
    <OrderDetailsPage
      orderCode={params.orderId}
      isJustPaid={searchParams?.paid === "1"}
    />
  );
}
