import { MyOrdersPage } from "@/modules/order/pages/my-orders";

// Trang phụ thuộc session Clerk nên không prerender tĩnh được
export const dynamic = "force-dynamic";

export interface MyOrdersPageRootProps {}

export default function MyOrdersPageRoot(_props: MyOrdersPageRootProps) {
  return <MyOrdersPage />;
}
