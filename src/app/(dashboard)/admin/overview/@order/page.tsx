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
import { cn } from "@/lib/utils";
import { EOrderStatus } from "@/types/enums";
import { formatDate } from "@/utils";

const page = async () => {
  const allOrders = await getAllOrders({
    limit: 5,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="p-5 rounded-lg bg-white border border-slate-200 dark:border-opacity-10 dark:bg-grayDarker">
        <h2 className="font-bold text-lg l:text-xl mb-0 lg:mb-5">
          Đơn hàng gần đây
        </h2>

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
                    <div className="max-w-[200px]">
                      <div className="line-clamp-1">{order.course.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{order.user.username}</div>
                    <div className="text-xs text-slate-400">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        orderStatus[order.status as EOrderStatus]?.className,
                        "py-1 px-2 rounded-full text-xs font-semibold"
                      )}
                    >
                      {orderStatus[order.status as EOrderStatus]?.text}
                    </span>
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
