import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { IconCube } from "@/shared/components";
import { ProgressBar } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

export interface PlanItemProps {
  title: string;
  price: number;
  isActive?: boolean;
  img?: string;
  save?: number;
  duration?: number;
  onButtonClick?: (amount: number) => void;
  alreadyActive?: boolean;
}

export default function PlanItem({
  title,
  price,
  isActive = false,
  img = "",
  save,
  duration,
  onButtonClick,
  alreadyActive,
}: PlanItemProps) {
  const benefits = ["Truy cập toàn bộ khóa học", "Nội dung hấp dẫn"];
  const { userInfo } = useUserContext();
  const remainingDays = dayjs(userInfo?.planEndDate).diff(dayjs(), "day");
  const totalDays = dayjs(userInfo?.planEndDate).diff(
    userInfo?.planStartDate,
    "day"
  );
  const progress = 100 - Math.floor((remainingDays / totalDays) * 100);

  return (
    <div
      className={cn("rounded-xl p-1 relative z-10", {
        "gradient-third": isActive,
      })}
    >
      {isActive && (
        <div className="font-bold text-white text-center pb-2 h-8">
          Best choice
        </div>
      )}
      <div className="border borderDarkMode bgDarkMode p-5 xl:p-3 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <Image src={img} width={40} height={40} alt={title} />
          {Number(save) > 0 && (
            <span className="py-1 px-3 rounded-full bg-primary text-white text-xs font-bold">
              Save {save}%
            </span>
          )}
        </div>
        <h2 className="font-bold text-base lg:text-lg capitalize mb-2">
          {title}
        </h2>
        <div className="mb-5">
          <span className="text-2xl font-bold">{formatThoundsand(price)}</span>
          <span className="text-sm font-semibold ml-1">/ {duration} tháng</span>
        </div>
        {alreadyActive && (
          <div className="flex flex-col gap-2">
            <div className="font-medium text-sm flex items-center justify-between">
              <span>Thời hạn còn</span>
              <strong className="text-primary text-base">
                {remainingDays} ngày
              </strong>
            </div>
            <ProgressBar progress={progress} />
            <Link
              className={cn(
                "w-full text-white bg-grayDark dark:bg-grayDarkest rounded-full font-bold h-10 flex items-center justify-center text-xs"
              )}
              href="/membership"
            >
              Thay đổi gói
            </Link>
          </div>
        )}
        {!alreadyActive && (
          <>
            <Button
              className={cn(
                "w-full text-white bg-grayDark dark:bg-grayDarkest rounded-full font-bold mb-5 h-10",
                {
                  "!bg-primary": isActive,
                }
              )}
              onClick={() => onButtonClick?.(price)}
            >
              Đăng ký
            </Button>
            <div className="flex flex-col gap-3">
              {benefits.map((item, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <div className="rounded-full p-1 size-6 flex-shrink-0 bg-secondary text-white flex items-center justify-center">
                    <IconCube className="size-3" />
                  </div>
                  <span className="font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
