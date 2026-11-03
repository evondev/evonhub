"use client";

import { useCoursePurchase } from "@/modules/course/hooks/use-course-purchase";
import type { RatingItemData } from "@/modules/rating/types";
import { sanitizeHtml } from "@/shared/helpers";
import { Clock, Lock } from "lucide-react";
import type { VideoDetailsData } from "../../../types";
import { getAverageRating } from "../../../utils";
import CourseReviews from "../../course-details-page/components/course-reviews";
import CourseSection from "../../course-details-page/components/course-section";
import { VideoBuyCard } from "./video-buy-card";
import { VideoDetailsHeader } from "./video-details-header";

export interface VideoLockedViewProps {
  video: VideoDetailsData;
  reviews: RatingItemData[];
}

/**
 * Video trả phí người xem chưa mua, hoặc video sắp ra mắt: bố cục như trang bán
 * khóa học. Hai cột từ xl, thẻ mua bên phải dính khi cuộn; màn hẹp thẻ mua nằm
 * ngay dưới tên video
 */
export function VideoLockedView({ video, reviews }: VideoLockedViewProps) {
  const purchase = useCoursePurchase({
    courseId: video._id,
    slug: video.slug,
    price: video.price,
  });
  const ratingAverage = getAverageRating(
    reviews.map((review) => review.rating),
  );

  return (
    <div className="grid grid-cols-1 gap-6 [grid-template-areas:'head'_'card'_'body'] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-x-8 xl:[grid-template-areas:'head_card'_'body_card']">
      <div className="[grid-area:head]">
        <VideoDetailsHeader
          title={video.title}
          level={video.level}
          durationMinutes={video.lesson.duration}
          ratingAverage={ratingAverage}
          ratingCount={reviews.length}
        />
      </div>
      {/* Header nổi cao 80px: dính ở 96px để thẻ cách header 16px như khe sidebar */}
      <aside className="self-start [grid-area:card] xl:sticky xl:top-24">
        <VideoBuyCard video={video} purchase={purchase} />
      </aside>
      <div className="flex min-w-0 flex-col gap-8 [grid-area:body]">
        {video.desc && (
          <CourseSection title="Giới thiệu">
            {/* Cùng kiểu chữ với phần Mô tả của trang bán khóa học */}
            <div
              className="lesson-content max-w-[70ch] !text-sm/7 !font-normal text-foreground/80 [&>*:last-child]:mb-0 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(video.desc) }}
            />
          </CourseSection>
        )}
        <p className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-muted">
          {video.isComingSoon ? (
            <Clock className="size-4 shrink-0" aria-hidden />
          ) : (
            <Lock className="size-4 shrink-0" aria-hidden />
          )}
          {video.isComingSoon
            ? "Video sắp ra mắt, nội dung đang được chuẩn bị."
            : "Mua video để xem toàn bộ video và nội dung đi kèm."}
        </p>
        <CourseReviews reviews={reviews} ratingAverage={ratingAverage} />
      </div>
    </div>
  );
}
