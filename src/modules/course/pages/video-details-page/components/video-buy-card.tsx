import type { CoursePurchase, VideoDetailsData } from "../../../types";
import CourseBuyButton from "../../course-details-page/components/course-buy-button";
import CourseBuyMedia from "../../course-details-page/components/course-buy-media";
import CourseBuyPrice from "../../course-details-page/components/course-buy-price";

export interface VideoBuyCardProps {
  video: VideoDetailsData;
  purchase: CoursePurchase;
}

/**
 * Thẻ mua của video chưa xem được: intro ngắn làm teaser, giá, nút mua. Video
 * sắp ra mắt thay nút mua bằng nút "Sắp ra mắt" bấm không được
 */
export function VideoBuyCard({ video, purchase }: VideoBuyCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <CourseBuyMedia title={video.title} intro={video.intro} image={video.image} />
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <CourseBuyPrice
          isFree={video.isFree}
          price={video.price}
          salePrice={video.salePrice}
          discount={purchase.discount}
        />
        <CourseBuyButton
          purchase={purchase}
          isFree={video.isFree}
          isComingSoon={video.isComingSoon}
          isOwned={false}
          cta={video.cta}
          firstLessonHref=""
          className="w-full"
        />
        <p className="text-pretty text-sm text-muted">
          {video.isComingSoon
            ? "Video đang được hoàn thiện, quay lại sau để xem nhé."
            : "Mua một lần, xem lại video và nội dung đi kèm bất cứ lúc nào."}
        </p>
      </div>
    </div>
  );
}
