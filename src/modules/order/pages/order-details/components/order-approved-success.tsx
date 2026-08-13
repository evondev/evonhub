"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const REDIRECT_SECONDS = 3;

export interface OrderApprovedSuccessProps {
  /** Chỉ đếm ngược khi khách vừa thanh toán xong ngay tại phiên này */
  isJustPaid?: boolean;
}

export function OrderApprovedSuccess({ isJustPaid }: OrderApprovedSuccessProps) {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (!isJustPaid) return;

    if (remainingSeconds <= 0) {
      router.push("/study");
      return;
    }

    const timer = setTimeout(
      () => setRemainingSeconds((current) => current - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [isJustPaid, remainingSeconds, router]);

  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <Image alt="" src="/check.png" width={100} height={100} />
      <h1 className="font-bold text-xl">
        {isJustPaid
          ? "Thanh toán thành công"
          : "Đơn hàng này đã được duyệt"}
      </h1>
      {isJustPaid && (
        <p className="text-sm text-slate-500">
          Đang chuyển tới khu vực học tập sau {remainingSeconds} giây...
        </p>
      )}
      <Link
        href="/study"
        className="mt-2 rounded-full flex items-center justify-center py-2 px-5 bg-secondary font-semibold text-white h-12"
      >
        Vào học ngay
      </Link>
    </div>
  );
}
