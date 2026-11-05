import { cn } from "@/shared/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { CoverStudyCount } from "./cover-study-count";

interface CourseCoverProps {
  image?: string;
  /** Khung ảnh: kích thước, tỉ lệ, bo góc */
  className: string;
  sizes: string;
  /** Ảnh đầu trang (thường là LCP): tải ngay thay vì đợi cuộn tới */
  isPriority?: boolean;
  /** Lượt học hiện ở góc dưới trái ảnh; bỏ trống hoặc 0 thì không hiện */
  studyCount?: number;
  studyCountClassName?: string;
}

/** Ảnh bìa khóa phủ kín khung; khóa chưa có ảnh thì hiện khung "Chưa có ảnh" */
export function CourseCover({
  image,
  className,
  sizes,
  isPriority = false,
  studyCount,
  studyCountClassName,
}: CourseCoverProps) {
  if (!image) {
    return (
      <div
        className={cn(
          "relative grid place-items-center bg-foreground/5 text-muted",
          className,
        )}
      >
        <span className="flex flex-col items-center gap-1 text-xs">
          <ImageOff className="size-5" />
          Chưa có ảnh
        </span>
        <CoverStudyCount count={studyCount} className={studyCountClassName} />
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
      <CoverStudyCount count={studyCount} className={studyCountClassName} />
    </div>
  );
}
