import { Button } from "@/components/ui/button";
import type { CourseCurriculumStats } from "@/modules/course/types";
import { CirclePlay } from "lucide-react";
import { forwardRef } from "react";
import CourseBuyButton, { CourseBuyButtonProps } from "./course-buy-button";
import CourseBuyMedia, { CourseBuyMediaProps } from "./course-buy-media";
import CourseBuyPrice from "./course-buy-price";
import CourseIncludes from "./course-includes";
import CourseOwnedNotice from "./course-owned-notice";

export interface CourseBuyCardProps
  extends Omit<CourseBuyButtonProps, "className">, CourseBuyMediaProps {
  price: number;
  salePrice: number;
  stats: CourseCurriculumStats;
  onTrialClick: () => void;
}

/**
 * Thẻ mua bên phải: ảnh hoặc video, giá, nút mua, học thử, "Khóa học gồm".
 * Ref trỏ vào hàng nút để biết lúc nào nút đã cuộn khỏi màn (hiện thanh mua dưới).
 */
const CourseBuyCard = forwardRef<HTMLDivElement, CourseBuyCardProps>(
  function CourseBuyCard(
    {
      title,
      intro,
      image,
      price,
      salePrice,
      stats,
      onTrialClick,
      ...buyButtonProps
    },
    actionsRef,
  ) {
    const { isFree, isOwned, purchase } = buyButtonProps;
    const shouldShowTrial = stats.trialCount > 0 && !isFree && !isOwned;

    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <CourseBuyMedia title={title} intro={intro} image={image} />
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          {isOwned && <CourseOwnedNotice />}
          {!isOwned && (
            <CourseBuyPrice
              isFree={isFree}
              price={price}
              salePrice={salePrice}
              discount={purchase.discount}
            />
          )}
          <div ref={actionsRef} className="flex flex-col gap-2">
            <CourseBuyButton {...buyButtonProps} className="w-full" />
            {shouldShowTrial && (
              <Button
                variant="outline"
                className="h-11 w-full px-5"
                onClick={onTrialClick}
              >
                <CirclePlay className="size-4 shrink-0" aria-hidden />
                Học thử {stats.trialCount} bài
              </Button>
            )}
          </div>
          {!isOwned && (
            <div className="border-t border-border pt-4">
              <CourseIncludes stats={stats} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default CourseBuyCard;
