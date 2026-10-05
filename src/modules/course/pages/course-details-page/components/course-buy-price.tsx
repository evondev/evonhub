import { getDiscountLabel } from "@/modules/course/utils";
import { cn } from "@/shared/utils";
import { formatThoundsand } from "@/utils";

export interface CourseBuyPriceProps {
  isFree: boolean;
  price: number;
  /** Giá gốc, gạch ngang cạnh giá bán */
  salePrice: number;
  /** Số tiền giảm từ mã giảm giá đã áp */
  discount: number;
}

export default function CourseBuyPrice({
  isFree,
  price,
  salePrice,
  discount,
}: CourseBuyPriceProps) {
  const hasSalePrice = salePrice > 0;
  const discountLabel = isFree
    ? ""
    : getDiscountLabel({ isFree, price, salePrice });

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      {isFree && (
        <span className="font-display text-3xl font-semibold text-emerald-700 dark:text-emerald-400">
          Miễn phí
        </span>
      )}
      {!isFree && (
        <span
          className={cn(
            "font-display text-3xl font-semibold tabular-nums",
            discount > 0 && "text-primary",
            discount <= 0 && "text-foreground",
          )}
        >
          {formatThoundsand(price - discount)} đ
        </span>
      )}
      {hasSalePrice && (
        <span className="text-sm tabular-nums text-muted line-through">
          {formatThoundsand(salePrice)} đ
        </span>
      )}
      {discountLabel && (
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium tabular-nums text-primary-strong">
          {discountLabel}
        </span>
      )}
    </div>
  );
}
