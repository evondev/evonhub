import { cn } from "@/shared/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";

interface CourseCoverProps {
  image?: string;
  /** Khung ảnh: kích thước, tỉ lệ, bo góc */
  className: string;
  sizes: string;
  /** Ảnh đầu trang (thường là LCP): tải ngay thay vì đợi cuộn tới */
  isPriority?: boolean;
}

/** Ảnh bìa khóa phủ kín khung; khóa chưa có ảnh thì hiện khung "Chưa có ảnh" */
export function CourseCover({
  image,
  className,
  sizes,
  isPriority = false,
}: CourseCoverProps) {
  if (!image) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-foreground/5 text-muted",
          className,
        )}
      >
        <span className="flex flex-col items-center gap-1 text-xs">
          <ImageOff className="size-5" />
          Chưa có ảnh
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={image}
        alt=""
        fill
        sizes={sizes}
        priority={isPriority}
        className="object-cover"
      />
    </div>
  );
}
