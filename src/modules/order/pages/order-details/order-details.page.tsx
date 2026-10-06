import { Suspense } from "react";
import { OrderDetailsLoader, OrderDetailsSkeleton } from "./components";

export interface OrderDetailsPageProps {
  orderCode: string;
  isJustPaid?: boolean;
}

export function OrderDetailsPage({
  orderCode,
  isJustPaid,
}: OrderDetailsPageProps) {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetailsLoader orderCode={orderCode} isJustPaid={isJustPaid} />
    </Suspense>
  );
}
