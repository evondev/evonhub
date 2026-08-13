"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleCheckCoupon } from "@/modules/coupon/actions";
import { userMutationEnrollCourse } from "@/modules/course/services/data/mutation-enroll";
import { userMutationEnrollFree } from "@/modules/course/services/data/mutation-enroll-free.data";
import { IconPlay, IconStudy, IconUsers } from "@/shared/components";
import { Card } from "@/shared/components/common";
import { MAXIUM_DISCOUNT } from "@/shared/constants/common.constants";
import { useAuthGuard } from "@/shared/hooks";
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

interface CouponMessage {
  error?: string;
  success?: string;
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
  const { ensureSignedIn } = useAuthGuard();
  const searchParams = useSearchParams();
  const appliedCoupon = searchParams.get("appliedCoupon") || "";

  const router = useRouter();
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [message, setMessage] = useState<CouponMessage>({
    error: "",
    success: "",
  });

  const handleEnrollFree = async () => {
    if (!ensureSignedIn("Vui lòng đăng nhập để nhận khóa học")) return;

    const response = await mutationEnrollFree.mutateAsync({ slug });

    if (response?.type === "success") {
      toast.success(response?.message);
      return;
    }
    toast.error(response?.message);
  };

  const handleBuyCourse = async () => {
    if (!ensureSignedIn("Vui lòng đăng nhập để mua khóa học")) return;

    const response = await mutationEnrollCourse.mutateAsync({
      courseId,
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
      <Card className="p-3 flex flex-col rounded-xl">
        <div className="p-3 bg-white rounded-xl dark:bg-grayDarker flex flex-col gap-5">
          {!isFree && (
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
          )}
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
              className="h-12 rounded-xl px-5 flex items-center justify-center bg-gradient-to-r from-[#cbabff] to-[#ff979a] text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
            >
              Hốt ngay
            </button>
          )}
          {(!isFree || isComingSoon) && (
            <>
              <div className="hidden flex-col gap-1">
                <div
                  className={cn(
                    "flex rounded-xl border borderDarkMode p-2 h-12 overflow-hidden",
                    {
                      "!border-red-500": !!message.error?.length,
                      "!border-green-500": !!message.success?.length,
                    },
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
                    // onClick={() => handleApplyCoupon()}
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
                className="h-12 rounded-xl px-5 flex items-center justify-center bg-primary text-white font-bold shadow-[0_0_1px_3px_rgb(203,_171,_255,0.2)] text-base w-full"
                onClick={() => !isComingSoon && handleBuyCourse()}
                disabled={isComingSoon || mutationEnrollCourse.isPending}
                isLoading={mutationEnrollCourse.isPending}
              >
                {isComingSoon ? "Sắp ra mắt" : cta || "Liên hệ"}
              </Button>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
