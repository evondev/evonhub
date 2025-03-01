"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserContext } from "@/components/user-context";
import { cn } from "@/lib/utils";
import {
  Heading,
  IconArrowLeft,
  IconArrowRight,
  IconCircleCheck,
  IconDelete,
} from "@/shared/components";
import { LabelStatus, PaginationControl } from "@/shared/components/common";
import {
  ITEMS_PER_PAGE,
  statusActions,
} from "@/shared/constants/common.constants";
import { OrderStatus, orderStatuses } from "@/shared/constants/order.constants";
import { MembershipPlan, UserRole } from "@/shared/constants/user.constants";
import { formatDate, formatThoundsand } from "@/shared/utils";
import Image from "next/image";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { userMutationUpdateFreeOrder } from "../../services/data/mutation-update-free-order.data";
import { userMutationUpdateOrder } from "../../services/data/mutation-update-order.data";
import { useQueryOrders } from "../../services/data/query-orders.data";
import { OrderItemData } from "../../types";
import { OrderAction } from "./components";

export interface OrderManagePageProps {}

export function OrderManagePage(_props: OrderManagePageProps) {
  const { userInfo } = useUserContext();

  const canAccess =
    !!userInfo?._id &&
    [UserRole.Admin, UserRole.Expert].includes(userInfo.role);

  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault(""),
    isFree: parseAsBoolean.withDefault(false),
    page: parseAsInteger.withDefault(1),
    status: parseAsString.withDefault(""),
  });

  const { data: orders } = useQueryOrders({
    enabled: !!canAccess,
    limit: ITEMS_PER_PAGE,
    page: filters.page,
    userRole: userInfo?.role,
    filter: filters.search,
    isFree: filters.isFree,
    userId: userInfo?._id,
    status: filters.status as OrderStatus,
  });

  const mutationUpdateOrder = userMutationUpdateOrder();
  const mutationUpdateFreeOrder = userMutationUpdateFreeOrder();

  if (!canAccess || !userInfo) return null;

  const handleUpdateFreeOrder = async () => {
    await mutationUpdateFreeOrder.mutateAsync({
      userRole: userInfo?.role,
    });
  };

  const handleApproveOrder = async (order: OrderItemData) => {
    Swal.fire({
      title: `Bạn muốn duyệt đơn hàng ${order.code}?`,
      text: "Vui lòng kiểm tra kỹ trước khi thực hiện",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await mutationUpdateOrder.mutateAsync({
          orderUser: order.user?._id,
          course: order?.course?._id,
          status: OrderStatus.Approved,
          code: order.code,
          plan: order.plan,
          userRole: userInfo?.role,
          amount: order.total,
        });
        if (response) {
          toast.success("Duyệt đơn hàng thành công");
        }
      }
    });
  };

  const handleRejectOrder = (order: OrderItemData) => {
    Swal.fire({
      title: `Bạn muốn hủy bỏ đơn hàng ${order.code}?`,
      text: "Vui lòng kiểm tra kỹ trước khi thực hiện",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await mutationUpdateOrder.mutateAsync({
          orderUser: order.user?._id,
          course: order?.course?._id,
          status: OrderStatus.Rejected,
          code: order.code,
          plan: order.plan,
          userRole: userInfo?.role,
          amount: order.total,
        });
        if (response) {
          toast.success("Hủy đơn hàng thành công");
        }
      }
    });
  };

  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row gap-5 lg:items-center justify-between min-h-10">
        <Heading className="mb-0">Quản lý đơn hàng</Heading>
        {userInfo?.role === UserRole.Admin && (
          <Button
            className="flex font-semibold px-4 h-10 text-sm rounded-md bg-grayDarkest dark:bg-white dark:text-grayDarkest text-white"
            onClick={handleUpdateFreeOrder}
            disabled={mutationUpdateFreeOrder.isPending}
          >
            Duyệt đơn hàng miễn phí
          </Button>
        )}
      </div>
      {userInfo?.role === UserRole.Admin && (
        <div className="mb-2 flex items-center justify-between px-3 py-2 bgDarkMode borderDarkMode rounded-lg flex-wrap gap-3">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-sm font-medium">
              <Switch
                checked={filters.isFree}
                onCheckedChange={(checked) => setFilters({ isFree: checked })}
              />
              <Label
                htmlFor="freeOrders"
                className="hidden lg:flex items-center gap-2 cursor-pointer"
              >
                <span>Đơn hàng miễn phí</span>
              </Label>
            </div>
            <div className="hidden lg:flex gap-3">
              {statusActions.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-2 h-7",
                    item.className
                  )}
                  onClick={() => setFilters({ status: item.value })}
                >
                  {item.text}
                  {filters.status === item.value && (
                    <IconCircleCheck className="size-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Input
              placeholder="DH1234567"
              className="w-full lg:w-[300px] h-10 hidden lg:block"
              onChange={(e) => setFilters({ search: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <PaginationControl
                onClick={() => setFilters({ page: filters.page - 1 })}
                disabled={filters.page <= 1}
              >
                <IconArrowLeft />
              </PaginationControl>
              <PaginationControl
                onClick={() => setFilters({ page: filters.page + 1 })}
              >
                <IconArrowRight />
              </PaginationControl>
            </div>
          </div>
          <Input
            placeholder="DH1234567"
            className="w-full lg:w-[300px] h-10 block lg:hidden"
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
      )}
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn hàng</TableHead>
            <TableHead>Khóa học</TableHead>
            <TableHead>Thành viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead className="text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders &&
            orders.length > 0 &&
            orders.map((order) => {
              const orderStatus = {
                isApproved: order.status === OrderStatus.Approved,
                isPending: order.status === OrderStatus.Pending,
                isRejected: order.status === OrderStatus.Rejected,
              };
              return (
                <TableRow key={order._id} className="font-medium">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/order/${order.code}`}
                        className="font-semibold"
                      >
                        {order.code}
                      </Link>
                      <div className="text-xs text-gray-400">
                        <span>Ngày tạo:</span>{" "}
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-[200px]">
                      {order?.course && (
                        <div className="font-semibold">
                          {order?.course?.title}
                        </div>
                      )}
                      {order?.plan !== MembershipPlan.None && (
                        <div className="font-bold uppercase text-base flex items-center gap-2">
                          <Image
                            src="/star-medal.png"
                            alt=""
                            width={32}
                            height={32}
                          />
                          <span>{order?.plan}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/user/update?email=${order.user?.email}`}
                      className="flex flex-col gap-1"
                    >
                      <div className="">{order.user?.username}</div>
                      <div className="text-xs text-slate-400">
                        {order.user?.email}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <LabelStatus
                      className={orderStatuses[order.status]?.className}
                    >
                      {orderStatuses[order.status]?.text}
                    </LabelStatus>
                  </TableCell>
                  <TableCell>
                    {orderStatus.isRejected && (
                      <LabelStatus
                        className={orderStatuses[order.status]?.className}
                      >
                        {orderStatuses[order.status]?.text}
                      </LabelStatus>
                    )}
                    {!orderStatus.isRejected && (
                      <div className="flex flex-col gap-2 items-start">
                        {order.amount > 0 && order.total > 0 && (
                          <p className="font-medium">
                            {formatThoundsand(order.amount)}
                          </p>
                        )}
                        {order.total <= 0 ? (
                          <LabelStatus
                            className={
                              orderStatuses[OrderStatus.Approved]?.className
                            }
                          >
                            Miễn phí
                          </LabelStatus>
                        ) : (
                          <p
                            className={cn(
                              "font-bold",
                              orderStatus.isApproved
                                ? "text-green-500"
                                : "text-orange-500"
                            )}
                          >
                            {orderStatus.isApproved && "+"}
                            {formatThoundsand(order.total)}
                          </p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 justify-end text-gray-400 dark:text-white">
                      {orderStatus.isPending && (
                        <>
                          <OrderAction
                            onClick={() => handleApproveOrder(order)}
                          >
                            <IconCircleCheck />
                          </OrderAction>
                          <OrderAction onClick={() => handleRejectOrder(order)}>
                            <IconDelete />
                          </OrderAction>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
}
