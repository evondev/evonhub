"use client";

import { Heading } from "@/shared/components";
import { useQueryCoupons } from "../../services/data/query-coupons.data";
import { CouponItem } from "./components/coupon-item";

export interface CouponHomePageProps {}

export function CouponHomePage(_props: CouponHomePageProps) {
  const { data: coupons } = useQueryCoupons({});

  const colors = ["#ffb86c", "#ff79c6", "#50fa7b", "#bd93f9", "#8be9fd"];
  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <Heading className="mb-0">Săn mã giảm giá</Heading>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {coupons?.map((coupon) => {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <CouponItem color={randomColor} key={coupon._id} coupon={coupon} />
          );
        })}
      </div>
    </>
  );
}
