"use client";

import { useUserContext } from "@/components/user-context";
import { ProgressBar } from "@/shared/components/common";
import { formatThoundsand } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";

export interface PlanCardProps {
  title: string;
  price: number;
  img: string;
  duration?: number;
}

/**
 * Hiển thị gói membership còn hạn của user. Tính năng bán gói đã ngưng nên
 * component này chỉ còn nhiệm vụ hiển thị thời hạn còn lại.
 */
export function PlanCard({ title, price, img, duration }: PlanCardProps) {
  const { userInfo } = useUserContext();
  const remainingDays = dayjs(userInfo?.planEndDate).diff(dayjs(), "day");
  const totalDays = dayjs(userInfo?.planEndDate).diff(
    userInfo?.planStartDate,
    "day"
  );
  const progress = totalDays > 0 ? 100 - (remainingDays / totalDays) * 100 : 0;

  return (
    <div className="rounded-xl p-1 relative z-10">
      <div className="border borderDarkMode bgDarkMode p-5 xl:p-3 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <Image src={img} width={40} height={40} alt={title} />
        </div>
        <h2 className="font-bold text-base lg:text-lg capitalize mb-2">
          {title}
        </h2>
        <div className="mb-5">
          <span className="text-2xl font-bold">{formatThoundsand(price)}</span>
          <span className="text-sm font-semibold ml-1">/ {duration} tháng</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm flex items-center justify-between">
            <span>Thời hạn còn</span>
            <strong className="text-primary text-base">
              {Math.max(remainingDays, 0)} ngày
            </strong>
          </div>
          <ProgressBar progress={Math.floor(progress)} />
        </div>
      </div>
    </div>
  );
}
