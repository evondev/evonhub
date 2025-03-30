"use client";
import { CouponItemData } from "@/modules/coupon/types";
import { IconCopy } from "@/shared/components";
import { CouponType } from "@/shared/constants/coupon.constants";
import { formatThoundsand } from "@/shared/utils";
import { toast } from "react-toastify";

export interface CouponItemProps {
  coupon: CouponItemData;
}

export function CouponItem({ coupon }: CouponItemProps) {
  const handleCopyCouponCode = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success("Sao chép mã giảm giá thành công");
  };

  return (
    <div className="p-3 rounded-lg border borderDarkMode bgDarkMode flex flex-col relative overflow-hidden group cursor-pointer">
      <div className="py-1 px-2 text-sm font-bold text-white gradient-secondary self-start absolute top-0 left-0">
        {formatThoundsand(coupon.amount)}
        {coupon.type === CouponType.Percentage ? "%" : ""}
      </div>
      <div className="flex items-center gap-3 justify-between mt-6">
        <h2 className="font-bold text-sm lg:text-base">{coupon.title}</h2>
        <button
          type="button"
          className={`size-10 rounded-full bgDarkMode border borderDarkMode flex items-center shrink-0 justify-center hover:bg-gray-100 dark:hover:bg-opacity-10`}
          onClick={handleCopyCouponCode}
        >
          <IconCopy />
        </button>
      </div>
    </div>
  );
}
