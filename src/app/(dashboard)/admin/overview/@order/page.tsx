import LabelStatus from "@/components/common/LabelStatus";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orderStatus } from "@/constants";
import { getAllOrders } from "@/lib/actions/order.action";
import { getUserById } from "@/lib/actions/user.action";
import { cn } from "@/lib/utils";
import { EOrderStatus } from "@/types/enums";
import { formatDate } from "@/utils";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const { userId } = auth();
  if (!userId) return null;
  const findUser = await getUserById({ userId });
  const allOrders = await getAllOrders({
    userId: findUser?._id,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="">
        <h2 className="font-bold text-lg l:text-xl mb-5">Đơn hàng gần đây</h2>

        <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Khóa học</TableHead>
              <TableHead>Thành viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày lập</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allOrders &&
              allOrders.map((order: any) => (
                <TableRow key={order._id} className="font-medium">
                  <TableCell className="font-bold">{order.code}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px] font-bold">
                      <div className="line-clamp-1">{order.course.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.user?.username}</div>
                    <div className="text-xs text-slate-400">
                      {order.user?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <LabelStatus
                      className={cn(
                        orderStatus[order.status as EOrderStatus]?.className
                      )}
                    >
                      {orderStatus[order.status as EOrderStatus]?.text}
                    </LabelStatus>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default page;
