"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Heading, IconCopy } from "@/shared/components";
import {
  StatusBadge,
  TableAction,
  TableActions,
} from "@/shared/components/common";
import { Tag } from "@/shared/components/tag";
import { formatDate } from "@/utils";
import Link from "next/link";
import { useQueryCoupons } from "../../services/data/query-coupons.data";

export interface CouponManagePageProps {}

export function CouponManagePage(_props: CouponManagePageProps) {
  const { data: coupons } = useQueryCoupons({});
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <Heading>Coupons</Heading>
        <Link
          href="/admin/coupon/create"
          className="flex items-center gap-3 px-3 w-[150px] justify-center h-12 text-sm rounded-xl bg-primary text-white font-semibold"
        >
          <span>Tạo coupon</span>
        </Link>
      </div>
      <Table className="bg-white rounded-xl dark:bg-grayDarker overflow-x-auto table-responsive">
        <TableHeader>
          <TableRow>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Mã giảm giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Áp dụng</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>&nbsp;</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons?.map((coupon) => (
            <TableRow key={coupon._id.toString()}>
              <TableCell className="font-medium">{coupon.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <strong>{coupon.code}</strong>
                  <IconCopy
                    onClick={() => navigator.clipboard.writeText(coupon.code)}
                    className="cursor-pointer size-6"
                  />
                </div>
              </TableCell>
              <TableCell>
                {new Date(coupon.endDate).getTime() < Date.now() ? (
                  <StatusBadge variant="warning">Hết hạn</StatusBadge>
                ) : (
                  <StatusBadge variant="success">Hoạt động</StatusBadge>
                )}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex gap-3 flex-wrap max-w-xl">
                  {coupon.courses.map((course) => {
                    return (
                      <Tag key={course.slug}>
                        <div className="line-clamp-1">{course.title}</div>
                      </Tag>
                    );
                  })}
                </div>
              </TableCell>
              <TableCell className="text-slate-600 font-medium whitespace-nowrap">
                <span>{formatDate(coupon.startDate)}</span> -{" "}
                <span>{formatDate(coupon.endDate)}</span>
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
