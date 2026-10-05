import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";
import CourseBuyButton, { CourseBuyButtonProps } from "./course-buy-button";

export interface CourseBuyBarProps extends Omit<
  CourseBuyButtonProps,
  "className"
> {
  price: number;
  salePrice: number;
  isVisible: boolean;
}

/**
 * Thanh giá + nút mua dính đáy màn hẹp. Trang này ẩn thanh điều hướng dưới của
 * app (MobileNavigation) nên thanh nằm sát đáy, chừa vùng an toàn của iPhone.
 * Chỉ hiện khi nút mua trong thẻ đã cuộn khỏi màn, để không có hai nút mua cùng lúc.
 */
export default function CourseBuyBar({
  price,
  salePrice,
  isVisible,
  ...buyButtonProps
}: CourseBuyBarProps) {
  const { isFree, isOwned, isComingSoon, purchase } = buyButtonProps;
  const hasSalePrice = salePrice > 0;

  if (isComingSoon) return null;

  return (
    <div
      aria-hidden={!isVisible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-surface px-4 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] pt-3 transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden",
        !isVisible && "invisible translate-y-full",
      )}
    >
      {isOwned && (
        <p className="min-w-0 truncate text-sm font-medium text-foreground">
          Bạn đã sở hữu khóa này
        </p>
      )}
      {!isOwned && (
        <div className="min-w-0">
          {isFree && (
            <p className="font-display text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              Miễn phí
            </p>
          )}
          {!isFree && (
            <p className="font-display text-lg font-semibold tabular-nums text-foreground">
              {formatThoundsand(price - purchase.discount)} đ
            </p>
          )}
          {hasSalePrice && (
            <p className="text-xs tabular-nums text-muted line-through">
              {formatThoundsand(salePrice)} đ
            </p>
          )}
        </div>
      )}
      <CourseBuyButton {...buyButtonProps} className="shrink-0" />
    </div>
  );
}
