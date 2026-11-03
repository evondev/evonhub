import type { CoursePurchase, VideoDetailsData } from "../../../types";
import CourseBuyButton from "../../course-details-page/components/course-buy-button";
import CourseBuyMedia from "../../course-details-page/components/course-buy-media";
import CourseBuyPrice from "../../course-details-page/components/course-buy-price";

export interface VideoBuyCardProps {
  video: VideoDetailsData;
  purchase: CoursePurchase;
}

/** Thẻ mua của video trả phí: intro ngắn làm teaser, giá, nút mua */
export function VideoBuyCard({ video, purchase }: VideoBuyCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <CourseBuyMedia title={video.title} intro={video.intro} image={video.image} />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <CourseBuyPrice
          isFree={false}
          price={video.price}
          salePrice={video.salePrice}
          discount={purchase.discount}
        />
        <CourseBuyButton
          purchase={purchase}
          isFree={false}
          isComingSoon={false}
          isOwned={false}
          cta={video.cta}
          firstLessonHref=""
          className="w-full"
        />
        <p className="text-pretty text-sm text-muted">
          Mua một lần, xem lại video và nội dung đi kèm bất cứ lúc nào.
        </p>
      </div>
    </div>
  );
}
