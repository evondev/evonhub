import { Button } from "@/components/ui/button";
import { IconCube } from "@/shared/components";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";

export interface PlanItemProps {
  title: string;
  price: number;
  isActive?: boolean;
  img?: string;
  save?: number;
  duration?: number;
  onButtonClick: (amount: number) => void;
}

export default function PlanItem({
  title,
  price,
  isActive = false,
  img = "",
  save,
  duration,
  onButtonClick,
}: PlanItemProps) {
  const benefits = [
    "Truy cập toàn bộ khóa học",
    "Nội dung độc quyền tại Evonhub",
    "Có nhóm hỗ trợ riêng",
  ];

  return (
    <div
      className={cn("rounded-xl p-2", {
        "gradient-third": isActive,
      })}
    >
      <div className="font-bold text-white text-center pb-2 h-8">
        {isActive ? "Best choice" : ""}
      </div>
      <div className="border borderDarkMode bgDarkMode p-5 rounded-lg">
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
        <div className="mb-8">
          <span className="text-2xl font-bold">{formatThoundsand(price)}</span>
          <span className="text-sm font-semibold ml-1">/ {duration} tháng</span>
        </div>
        <Button
          className={cn(
            "w-full text-white bg-grayDark dark:bg-grayDarkest rounded-full font-bold mb-10",
            {
              "!bg-primary": isActive,
            }
          )}
          onClick={() => onButtonClick(price)}
        >
          Đăng ký
        </Button>
        <div className="flex flex-col gap-5">
          {benefits.map((item, index) => (
            <div className="flex items-center gap-2" key={index}>
              <div className="rounded-full p-1 size-6 flex-shrink-0 bg-secondary text-white flex items-center justify-center">
                <IconCube className="size-3" />
              </div>
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
