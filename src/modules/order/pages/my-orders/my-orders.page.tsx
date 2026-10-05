import { Suspense } from "react";
import { MyOrdersLoader, MyOrdersSkeleton } from "./components";

export interface MyOrdersPageProps {}

export function MyOrdersPage(_props: MyOrdersPageProps) {
  return (
    <Suspense fallback={<MyOrdersSkeleton />}>
      <MyOrdersLoader />
    </Suspense>
  );
}
