"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading } from "@/shared/components";
import {
  StatusBadge,
  TableAction,
  TableActions,
} from "@/shared/components/common";
import { formatDate } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useQueryCoupons } from "../../services/data/query-coupons.data";

export interface CouponManagePageProps {}

export function CouponManagePage(_props: CouponManagePageProps) {
  const { data: coupons } = useQueryCoupons({});
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Heading className="mb-0">Coupons</Heading>
        <Link
          href="/admin/coupon/create"
          className="flex items-center gap-3 px-3 w-[150px] justify-center h-12 text-sm rounded-lg bg-primary text-white font-semibold"
        >
          <span>Tạo coupon</span>
        </Link>
      </div>
      <Table className="bg-white rounded-lg dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Mã giảm giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Áp dụng</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Tạo bởi</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons?.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell>
                <strong>{coupon.code}</strong>
              </TableCell>
              <TableCell>
                {new Date(coupon.endDate).getTime() < Date.now() ? (
                  <StatusBadge variant="warning">Hết hạn</StatusBadge>
                ) : (
                  <StatusBadge variant="success">Hoạt động</StatusBadge>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {coupon.courses.map((course) => {
                  return (
                    <div key={course.slug} className="w-[300px]">
                      {course.title}
                    </div>
                  );
                })}
              </TableCell>
              <TableCell className="text-gray-600 whitespace-nowrap">
                <span>{formatDate(coupon.startDate)}</span> -{" "}
                <span>{formatDate(coupon.endDate)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    alt=""
                    width={40}
                    height={40}
                    src={coupon.createdBy?.avatar}
                    className="size-10 rounded-full"
                  />
                  <strong>{coupon.createdBy?.username}</strong>
                </div>
              </TableCell>
              <TableCell>
                <TableActions>
                  <TableAction
                    icon="edit"
                    url={`/admin/coupon/${coupon.code}`}
                  ></TableAction>
                  <TableAction icon="delete"></TableAction>
                </TableActions>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
