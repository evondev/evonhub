import OrderManage from "@/components/order/OrderManage";
import { getAllOrders } from "@/lib/actions/order.action";
import { getUserById } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const findUser = await getUserById({ userId });
  if (!findUser || findUser.role !== Role.ADMIN) return null;
  const allOrders = await getAllOrders();
  return (
    <OrderManage
      allOrders={allOrders ? JSON.parse(JSON.stringify(allOrders)) : []}
    />
  );
};

export default page;
