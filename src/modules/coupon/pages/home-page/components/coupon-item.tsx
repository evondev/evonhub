"use client";
import { Button } from "@/components/ui/button";
import { CouponItemData } from "@/modules/coupon/types";
import Image from "next/image";
import { useState } from "react";

export interface CouponItemProps {
  coupon: CouponItemData;
}

export function CouponItem({ coupon }: CouponItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyCouponCode = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(coupon.code);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  return (
    <div className="p-3 rounded-lg border borderDarkMode bgDarkMode">
      <Image alt="" src="/coupons.png" width={40} height={40} />
      <h2 className="font-bold mb-5 text-lg lg:text-xl">{coupon.title}</h2>
      <Button
        variant="primary"
        className="w-full text-base font-bold"
        onClick={handleCopyCouponCode}
        disabled={isCopied}
      >
        {isCopied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
