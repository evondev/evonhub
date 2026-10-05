import { fetchMyOrders } from "../../../actions";
import { toMyOrderItem } from "../../../utils";
import { MyOrdersLoadError } from "./my-orders-load-error";
import { MyOrdersView } from "./my-orders-view";

export async function MyOrdersLoader() {
  const orders = await fetchMyOrders();

  if (!orders) return <MyOrdersLoadError />;

  return (
    <MyOrdersView
      orders={orders.map(toMyOrderItem)}
      referenceTime={Date.now()}
    />
  );
}
