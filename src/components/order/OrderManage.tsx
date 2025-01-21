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
import { deleteUnpaidOrders, updateOrder } from "@/lib/actions/order.action";
import { cn } from "@/lib/utils";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { EOrderStatus } from "@/types/enums";
import { formUrlQuery, formatDate, formatThoundsand } from "@/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LabelStatus from "../common/LabelStatus";
import { IconDelete, IconStar } from "../icons";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
const OrderManage = ({
  allOrders,
  userId,
}: {
  allOrders: any[];
  userId: string;
}) => {
  const handleRejectOrder = async ({
    user,
    course,
    status,
    code,
    plan,
  }: {
    user: string;
    course: string;
    status: EOrderStatus;
    code: string;
    plan: MembershipPlan;
  }) => {
    try {
      await updateOrder({
        code,
        user,
        course,
        status,
        plan,
      });
    } catch (error) {}
  };
  const [page, setPage] = useState(1);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFreeOrders, setIsFreeOrders] = useState(
    searchParams?.get("freeOrders") === "true"
  );

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
          plan: order.plan,
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

  const handleFilterFreeOrders = (checked: boolean) => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "freeOrders",
      value: checked ? "true" : "",
    });
    router.push(newUrl);
  };

  const handleRemoveUnPaidOrders = async () => {
    try {
      const response = await deleteUnpaidOrders({
        userId,
      });
      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Xóa đơn hàng chưa thanh toán thành công");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold">Quản lý đơn hàng</h1>
        <div className="flex gap-5 items-center">
          <Input
            placeholder="Tìm kiếm đơn hàng"
            className="w-full lg:w-[300px] h-12"
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
      {!!allOrders.length && (
        <div className="mb-2 flex items-center justify-between px-4 py-2 bgDarkMode borderDarkMode rounded-lg">
          <div className="flex items-center gap-3 text-sm font-medium">
            <Checkbox
              defaultChecked={isFreeOrders}
              onCheckedChange={(checked) =>
                handleFilterFreeOrders(checked as boolean)
              }
              id="freeOrders"
            />
            <Label
              htmlFor="freeOrders"
              className="flex items-center gap-2 cursor-pointer"
            >
              <span>Đơn hàng miễn phí</span>
              <IconStar className="size-6 text-secondary" />
            </Label>
          </div>
          <Button className="hidden lg:flex" onClick={handleRemoveUnPaidOrders}>
            Xóa đơn hàng chưa thanh toán(24h)
          </Button>
        </div>
      )}

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
                  <div className="w-[200px]">
                    {order?.course && (
                      <div className="font-bold">{order?.course?.title}</div>
                    )}
                    {order?.plan !== MembershipPlan.None && (
                      <div className="font-bold text-primary">
                        Gói: {order?.plan}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/admin/user/update?email=${order.user?.email}`}
                    className="flex flex-col"
                  >
                    <div className="">{order.user?.username}</div>
                    <div className="text-xs text-slate-400">
                      {order.user?.email}
                    </div>
                  </Link>
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
                  <div className="flex flex-col gap-2 items-start">
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
                                  plan: order.plan,
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
