"use client";

import { useParams } from "next/navigation";
import { useQueryCouponByCode } from "../../services/data/query-coupon-by-code.data";

export interface CouponUpdatePageProps {}

export function CouponUpdatePage(_props: CouponUpdatePageProps) {
  const params = useParams();
  const { data: couponDetails } = useQueryCouponByCode({
    code: params.code as string,
  });

  console.info(
    " coupon-update.page.tsx:16 - CouponUpdatePage - couponDetails:",
    couponDetails
  );

  return <div>CouponUpdatePage</div>;
}
