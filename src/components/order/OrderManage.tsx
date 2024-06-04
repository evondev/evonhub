"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { actionClassName, orderStatus } from "@/constants";
import { updateOrder } from "@/lib/actions/order.action";
import { cn } from "@/lib/utils";
import { EOrderStatus } from "@/types/enums";
import { formatDate, formatThoundsand } from "@/utils";
import { IconDelete } from "../icons";
const OrderManage = ({ allOrders }: { allOrders: any[] }) => {
  const handleRejectOrder = async ({
    user,
    course,
    status,
  }: {
    user: string;
    course: string;
    status: EOrderStatus;
  }) => {
    try {
      await updateOrder({
        user,
        course,
        status,
      });
    } catch (error) {}
  };
  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Quản lý đơn hàng</h1>
        <Input
          placeholder="Tìm kiếm đơn hàng"
          className="w-full lg:w-[300px]"
        />
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox />
            </TableHead>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Thành viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Ngày lập</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allOrders.map((order: any) => (
            <TableRow key={order._id} className="font-medium">
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-bold text-nowrap">
                {order.code}
              </TableCell>
              <TableCell>
                <div className="w-[300px]">
                  <div className="">{order.course.title}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-semibold">{order.user?.username}</div>
                <div className="text-xs text-slate-400">
                  {order.user?.email}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    orderStatus[order.status as EOrderStatus]?.className,
                    "py-1 px-2 rounded-full font-semibold"
                  )}
                >
                  {orderStatus[order.status as EOrderStatus]?.text}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-2 font-medium">
                  <div className="flex gap-2 items-end">
                    <p className="font-medium">
                      {formatThoundsand(order.amount)}
                    </p>
                    {order.discount > 0 && (
                      <span className="line-through text-slate-400">
                        {formatThoundsand(order.discount)}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary font-bold">
                    {formatThoundsand(order.total)}
                  </p>
                </div>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4 justify-center text-gray-400 dark:text-white">
                  {order.status !== EOrderStatus.APPROVED && (
                    <button
                      className={cn(actionClassName)}
                      onClick={() =>
                        handleRejectOrder({
                          user: order.user?._id,
                          course: order.course._id,
                          status: EOrderStatus.APPROVED,
                        })
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  )}
                  {order.status !== EOrderStatus.REJECTED && (
                    <button
                      className={cn(actionClassName)}
                      onClick={() =>
                        handleRejectOrder({
                          user: order.user?._id,
                          course: order.course._id,
                          status: EOrderStatus.REJECTED,
                        })
                      }
                    >
                      <IconDelete />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default OrderManage;
