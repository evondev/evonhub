import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import Image from "next/image";

export interface PackageItemProps {
  title: string;
  price: number;
  isActive?: boolean;
  onClick?: () => void;
  img?: string;
}

export default function PackageItem({
  title,
  price,
  isActive = false,
  onClick,
  img = "",
}: PackageItemProps) {
  return (
    <div
      className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-lg p-3 flex flex-col transition-all relative dark:bg-grayDarkest cursor-pointer"
      onClick={onClick}
    >
      <div
        className={cn(
          "bg-white rounded-lg h-full flex flex-col items-center px-3 py-5 gap-3 dark:bg-grayDarker",
          {
            "bg-primary text-white": isActive,
          }
        )}
      >
        <Image alt="" width={50} height={50} src={img} />
        <h2 className="font-bold text-xl lg:text-2xl">{title}</h2>
        <h3 className="text-2xl lg:text-3xl">{formatThoundsand(price)}</h3>
      </div>
    </div>
  );
}
