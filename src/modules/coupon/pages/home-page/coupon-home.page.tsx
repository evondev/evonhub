"use client";

import { Heading } from "@/shared/components";
import { CouponStatus } from "@/shared/constants/coupon.constants";
import { useQueryCoupons } from "../../services/data/query-coupons.data";
import { CouponItem } from "./components/coupon-item";

export interface CouponHomePageProps {}

export function CouponHomePage(_props: CouponHomePageProps) {
  const { data: coupons } = useQueryCoupons({
    status: CouponStatus.Active,
    shouldFilterOutdated: true,
  });

  return (
    <div className="flex flex-col gap-5">
      <Heading>Săn mã giảm giá</Heading>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {coupons?.map((coupon) => {
          return <CouponItem key={coupon._id} coupon={coupon} />;
        })}
      </div>
    </div>
  );
}
