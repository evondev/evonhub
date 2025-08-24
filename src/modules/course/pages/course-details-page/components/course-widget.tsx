"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/components/user-context";
import { handleCheckCoupon } from "@/modules/coupon/actions";
import { CouponItemData } from "@/modules/coupon/types";
import { userMutationEnrollCourse } from "@/modules/course/services/data/mutation-enroll";
import { userMutationEnrollFree } from "@/modules/course/services/data/mutation-enroll-free.data";
import { IconPlay, IconStudy, IconUsers } from "@/shared/components";
import { MAXIUM_DISCOUNT } from "@/shared/constants/common.constants";
import { CouponType } from "@/shared/constants/coupon.constants";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface CourseWidgetProps {
  isFree?: boolean;
  price: number;
  salePrice: number;
  cta?: string;
  isComingSoon?: boolean;
  slug: string;
  courseId: string;
}

export default function CourseWidget({
  isFree,
  price,
  salePrice,
  cta,
  isComingSoon,
  slug,
  courseId,
}: CourseWidgetProps) {
  const mutationEnrollFree = userMutationEnrollFree();
  const mutationEnrollCourse = userMutationEnrollCourse();
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";
  const searchParams = useSearchParams();
  const appliedCoupon = searchParams.get("appliedCoupon") || "";

  const router = useRouter();
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [findCoupon, setFindCoupon] = useState<CouponItemData | null>(null);
  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  }>({
    error: "",
    success: "",
  });

  const handleEnrollFree = async () => {
    const response = await mutationEnrollFree.mutateAsync({
      slug,
      userId,
    });
    console.log("console.remove - handleEnrollFree - response:", response);
    if (response?.type === "success") {
      toast.success(response?.message);
      return;
    }
    toast.error(response?.message);
  };

  const handleBuyCourse = async () => {
    if (discount > MAXIUM_DISCOUNT) {
      toast.error("Mã giảm giá không hợp lệ");
      return;
    }
    const response = await mutationEnrollCourse.mutateAsync({
      userId,
      courseId,
      amount: price,
      total: price - discount,
      couponId: findCoupon?._id || "",
      couponCode,
    });

    if (response?.error) {
      toast.error(response?.error);
      return;
    }
    if (response?.order?.code) {
      router.push(`/order/${response?.order?.code}`);
    }
  };

  const handleApplyCoupon = async (appliedCoupon?: string) => {
    const response = await handleCheckCoupon({
      code: appliedCoupon || couponCode,
      courseId,
    });

    if (!response?.amount || response?.amount > MAXIUM_DISCOUNT) {
      setMessage({ error: "Invalid coupon" });
      return;
    }
    if (response?.type === CouponType.Fixed) {
      setMessage({
        success: `Bạn đã được giảm: ${formatThoundsand(response.amount)} VNĐ`,
      });
    } else {
      setMessage({
        success: `Bạn đã được giảm: ${response.amount}%`,
      });
    }
    setFindCoupon(response);
    if (response?.type === CouponType.Percentage) {
      setDiscount((price * response.amount) / 100);
    } else {
      setDiscount(response.amount);
    }
  };

  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon);
      handleApplyCoupon(appliedCoupon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedCoupon]);

  return (
    <>
      <div className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
        <div className="p-3 bg-white rounded-lg dark:bg-grayDarker flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isFree ? (
                <strong className="text-xl text-primary">Miễn phí</strong>
              ) : (
                <>
                  <strong
                    className={cn("text-lg lg:text-xl", {
                      "text-primary": discount > 0,
                    })}
                  >
                    {formatThoundsand(price - discount)} VNĐ
                  </strong>
                  <span className="text-sm line-through text-slate-400">
                    {formatThoundsand(salePrice)} VNĐ
                  </span>
                </>
              )}
            </div>
            <span className="inline-block py-1 px-3 rounded-full bg-primary bg-opacity-20 text-primary font-bold">
              {isFree
                ? "-100%"
                : `-${100 - Math.floor((price / salePrice) * 100)} %`}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <IconPlay className="size-4 flex-shrink-0" />
              <span>Video quay full HD</span>
            </div>
            <div className="flex items-center gap-2">
              <IconUsers className="size-4 flex-shrink-0" />
              <span>Hỗ trợ trong quá trình học</span>
            </div>
            <div className="flex items-center gap-2">
              <IconStudy className="size-4 flex-shrink-0" />
              <span>Có tài liệu kèm theo</span>
            </div>
          </div>

          {isFree && !isComingSoon && (
            <button
              type="button"
              onClick={handleEnrollFree}
              className="h-12 rounded-lg px-5 flex items-center justify-center bg-gradient-to-r from-[#cbabff] to-[#ff979a] text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
            >
              Lụm liền
            </button>
          )}
          {(!isFree || isComingSoon) && (
            <>
              <div className="flex flex-col gap-1">
                <div
                  className={cn(
                    "flex rounded-lg border borderDarkMode p-2 h-12 overflow-hidden",
                    {
                      "!border-red-500": !!message.error?.length,
                      "!border-green-500": !!message.success?.length,
                    }
                  )}
                >
                  <Input
                    placeholder="Nhập mã giảm giá"
                    className="border-none uppercase !shadow-none !font-bold h-auto"
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                  />
                  <Button
                    className="text-white bg-grayDarkest h-auto dark:bg-white dark:text-grayDarkest"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode}
                  >
                    Áp dụng
                  </Button>
                </div>
                {message.error && message.error?.length > 0 && (
                  <div className="text-sm font-bold text-red-500">
                    {message.error}
                  </div>
                )}
                {message.success && message.success?.length > 0 && (
                  <div className="text-sm font-bold text-green-500">
                    {message.success}
                  </div>
                )}
              </div>
              <Button
                className="h-12 rounded-lg px-5 flex items-center justify-center bg-gradient-to-r from-[#cbabff] to-[#ff979a] text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
                onClick={() => !isComingSoon && handleBuyCourse()}
                disabled={isComingSoon || mutationEnrollCourse.isPending}
                isLoading={mutationEnrollCourse.isPending}
              >
                {isComingSoon ? "Sắp ra mắt" : cta || "Đăng ký ngay"}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
