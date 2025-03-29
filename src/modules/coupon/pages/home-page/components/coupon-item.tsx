"use client";
import { CouponItemData } from "@/modules/coupon/types";
import { IconCopy } from "@/shared/components";
import { cn } from "@/shared/utils";
import { toast } from "react-toastify";

export interface CouponItemProps {
  coupon: CouponItemData;
  color: string;
}

export function CouponItem({ coupon, color }: CouponItemProps) {
  const handleCopyCouponCode = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success("Sao chép mã giảm giá thành công");
  };

  return (
    <div className="p-3 rounded-lg border borderDarkMode bgDarkMode flex justify-between gap-3 items-center relative overflow-hidden pl-6 group cursor-pointer">
      <div
        className={cn("w-3 absolute top-0 left-0 h-full")}
        style={{ backgroundColor: color }}
      ></div>
      <h2 className="font-bold text-sm lg:text-base">{coupon.title}</h2>
      <button
        type="button"
        className={`size-10 rounded-full bgDarkMode border borderDarkMode flex items-center shrink-0 justify-center hover:bg-gray-100 dark:hover:bg-opacity-10`}
        onClick={handleCopyCouponCode}
      >
        <IconCopy />
      </button>
    </div>
  );
}
