"use client";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heading, IconPlus } from "@/shared/components";
import Link from "next/link";

export interface CouponManagePageProps {}

export function CouponManagePage(_props: CouponManagePageProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <Heading className="mb-0">Coupons</Heading>
        <Link
          href="/admin/coupon/create"
          className="flex items-center gap-3 px-3 h-12 text-sm rounded-lg bg-primary text-white font-semibold"
        >
          <IconPlus className="size-5" />
          <span>Tạo coupon</span>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Used</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Courses</TableHead>
            <TableHead>Created by</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </>
  );
}
