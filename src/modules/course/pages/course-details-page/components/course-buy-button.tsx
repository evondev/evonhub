import { Button } from "@/components/ui/button";
import type { CoursePurchase } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import Link from "next/link";

export interface CourseBuyButtonProps {
  purchase: CoursePurchase;
  isFree: boolean;
  isComingSoon: boolean;
  isOwned: boolean;
  /** Chữ trên nút mua, admin đặt cho từng khóa */
  cta?: string;
  /** Bài đầu tiên, nơi "Vào học" dẫn tới */
  firstLessonHref: string;
  className?: string;
}

/** Hành động chính của trang, dùng chung cho thẻ mua và thanh mua dưới màn */
export default function CourseBuyButton({
  purchase,
  isFree,
  isComingSoon,
  isOwned,
  cta,
  firstLessonHref,
  className,
}: CourseBuyButtonProps) {
  const buttonClassName = cn("h-11 px-5", className);

  if (isOwned) {
    return (
      <Button asChild variant="primary" className={buttonClassName}>
        <Link href={firstLessonHref}>Vào học</Link>
      </Button>
    );
  }

  if (isComingSoon) {
    return (
      <Button variant="primary" disabled className={buttonClassName}>
        Sắp ra mắt
      </Button>
    );
  }

  if (isFree) {
    return (
      <Button
        variant="primary"
        className={buttonClassName}
        onClick={purchase.handleEnrollFree}
        isLoading={purchase.isEnrollingFree}
      >
        Hốt ngay
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      className={buttonClassName}
      onClick={purchase.handleBuyCourse}
      isLoading={purchase.isBuying}
    >
      {cta || "Liên hệ"}
    </Button>
  );
}
