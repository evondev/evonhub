"use client";

import { handleCheckCoupon } from "@/modules/coupon/actions";
import { userMutationEnrollCourse } from "@/modules/course/services/data/mutation-enroll";
import { userMutationEnrollFree } from "@/modules/course/services/data/mutation-enroll-free.data";
import { MAXIUM_DISCOUNT } from "@/shared/constants/common.constants";
import { CouponType } from "@/shared/constants/coupon.constants";
import { useAuthGuard } from "@/shared/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { CoursePurchase } from "../types";

interface UseCoursePurchaseProps {
  courseId: string;
  slug: string;
  price: number;
}

/**
 * Mua khóa, nhận khóa miễn phí và áp mã giảm giá từ `?appliedCoupon=` trên URL.
 * Thẻ mua và thanh mua dưới màn hình dùng chung một bản để không gọi hai lần.
 */
export function useCoursePurchase({
  courseId,
  slug,
  price,
}: UseCoursePurchaseProps): CoursePurchase {
  const mutationEnrollFree = userMutationEnrollFree();
  const mutationEnrollCourse = userMutationEnrollCourse();
  const { ensureSignedIn } = useAuthGuard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const appliedCoupon = searchParams.get("appliedCoupon") || "";
  const [discount, setDiscount] = useState(0);

  async function handleEnrollFree() {
    if (!ensureSignedIn("Bạn cần đăng nhập trước khi nhận khóa học")) return;

    const response = await mutationEnrollFree.mutateAsync({ slug });

    if (response?.type === "success") {
      toast.success(response?.message);
      return;
    }
    toast.error(response?.message);
  }

  async function handleBuyCourse() {
    if (!ensureSignedIn("Bạn cần đăng nhập trước khi mua khóa học")) return;

    const response = await mutationEnrollCourse.mutateAsync({
      courseId,
      couponCode: appliedCoupon,
    });

    if (response?.error) {
      toast.error(response?.error);
      return;
    }
    if (response?.order?.code) {
      router.push(`/order/${response?.order?.code}`);
    }
  }

  useEffect(() => {
    if (!appliedCoupon || !courseId) return;

    async function applyCoupon() {
      const response = await handleCheckCoupon({
        code: appliedCoupon,
        courseId,
      });

      if (!response?.amount || response.amount > MAXIUM_DISCOUNT) return;

      if (response.type === CouponType.Percentage) {
        setDiscount((price * response.amount) / 100);
        return;
      }
      setDiscount(response.amount);
    }

    applyCoupon();
  }, [appliedCoupon, courseId, price]);

  return {
    discount,
    isBuying: mutationEnrollCourse.isPending,
    isEnrollingFree: mutationEnrollFree.isPending,
    handleBuyCourse,
    handleEnrollFree,
  };
}
