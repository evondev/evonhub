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
import {
  ArrowLeft,
  ArrowRight,
  actionClassName,
  orderStatus,
  pagiBtn,
} from "@/constants";
import { updateOrder } from "@/lib/actions/order.action";
import { cn } from "@/lib/utils";
import { EOrderStatus } from "@/types/enums";
import { formUrlQuery, formatDate, formatThoundsand } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import LabelStatus from "../common/LabelStatus";
import { IconDelete } from "../icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
const OrderManage = ({ allOrders }: { allOrders: any[] }) => {
  const handleRejectOrder = async ({
    user,
    course,
    status,
    code,
  }: {
    user: string;
    course: string;
    status: EOrderStatus;
    code: string;
  }) => {
    try {
      await updateOrder({
        code,
        user,
        course,
        status,
      });
    } catch (error) {}
  };
  const [page, setPage] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChangePage = (action: "prev" | "next") => {
    if (page === 1 && action === "prev") return;
    if (action === "prev") {
      setPage((prev) => prev - 1);
    } else {
      setPage((prev) => prev + 1);
    }
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "page",
      value: action === "prev" ? `${page - 1}` : `${page + 1}`,
    });
    router.push(newUrl);
  };
  const handleCancelOrder = (order: any) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn hủy đơn hàng?",
      text: "Hành động này không thể hoàn tác",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRejectOrder({
          user: order.user?._id,
          course: order?.course?._id,
          status: EOrderStatus.REJECTED,
          code: order.code,
        });
      }
    });
  };
  const handleFilter = (filter: string) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "search",
      value: filter,
    });
    router.push(newUrl);
  };
  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-5 items-center">
          <Input
            placeholder="Tìm kiếm đơn hàng"
            className="w-full lg:w-[300px] h-10"
            onChange={(e) => handleFilter(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <button
              className={pagiBtn}
              onClick={() => handleChangePage("prev")}
            >
              {ArrowLeft}
            </button>
            <button
              className={pagiBtn}
              onClick={() => handleChangePage("next")}
            >
              {ArrowRight}
            </button>
          </div>
        </div>
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
          {allOrders.length > 0 &&
            allOrders.map((order: any) => (
              <TableRow key={order._id} className="font-medium">
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-bold text-nowrap">
                  {order.code}
                </TableCell>
                <TableCell>
                  <div className="w-[300px]">
                    <div className="font-bold">{order?.course?.title}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="">{order.user?.username}</div>
                  <div className="text-xs text-slate-400">
                    {order.user?.email}
                  </div>
                </TableCell>
                <TableCell>
                  <LabelStatus
                    className={
                      orderStatus[order.status as EOrderStatus]?.className
                    }
                  >
                    {orderStatus[order.status as EOrderStatus]?.text}
                  </LabelStatus>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    {order.amount > 0 && order.total > 0 && (
                      <p className="font-medium">
                        {formatThoundsand(order.amount)}
                      </p>
                    )}
                    {order.total <= 0 ? (
                      <LabelStatus
                        className={
                          orderStatus[EOrderStatus.APPROVED]?.className
                        }
                      >
                        Miễn phí
                      </LabelStatus>
                    ) : (
                      <p
                        className={cn(
                          "font-bold",
                          order.status === EOrderStatus.APPROVED
                            ? "text-green-500"
                            : "text-orange-500"
                        )}
                      >
                        {order.status === EOrderStatus.APPROVED && "+"}
                        {formatThoundsand(order.total)}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-4 justify-end text-gray-400 dark:text-white">
                    {order.status === EOrderStatus.PENDING && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className={cn(actionClassName)}
                              onClick={() =>
                                handleRejectOrder({
                                  user: order.user?._id,
                                  course: order?.course?._id,
                                  status: EOrderStatus.APPROVED,
                                  code: order.code,
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
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Duyệt đơn hàng</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {order.status !== EOrderStatus.REJECTED && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <span
                              className={cn(actionClassName)}
                              onClick={() => handleCancelOrder(order)}
                            >
                              <IconDelete />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hủy đơn hàng</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
