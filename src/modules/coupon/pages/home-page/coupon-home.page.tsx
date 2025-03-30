"use client";

import { Heading } from "@/shared/components";
import { CouponStatus } from "@/shared/constants/coupon.constants";
import { useQueryCoupons } from "../../services/data/query-coupons.data";
import { CouponItem } from "./components/coupon-item";

export interface CouponHomePageProps {}

export function CouponHomePage(_props: CouponHomePageProps) {
  const { data: coupons } = useQueryCoupons({
    status: CouponStatus.Active,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <Heading className="mb-0">Săn mã giảm giá</Heading>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {coupons?.map((coupon) => {
          return <CouponItem key={coupon._id} coupon={coupon} />;
        })}
      </div>
    </>
  );
}
