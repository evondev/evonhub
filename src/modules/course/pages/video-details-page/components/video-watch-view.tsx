import { LessonNotes } from "@/modules/lesson/components";
import type { RatingItemData } from "@/modules/rating/types";
import type { VideoDetailsData, VideoListItem } from "../../../types";
import { getAverageRating } from "../../../utils";
import CourseReviews from "../../course-details-page/components/course-reviews";
import CourseSection from "../../course-details-page/components/course-section";
import { VideoCard } from "../../video-list-page/components/video-card";
import { VideoComments } from "./video-comments";
import { VideoDetailsHeader } from "./video-details-header";
import { VideoPlayer } from "./video-player";
import { VideoRatingButton } from "./video-rating-button";

export interface VideoWatchViewProps {
  video: VideoDetailsData;
  reviews: RatingItemData[];
  /** Video mới nhất khác video đang xem; rỗng thì không có khối này */
  relatedVideos: VideoListItem[];
}

/** Người xem được video (miễn phí, đã mua, người quản lý): video, nội dung, bình luận */
export function VideoWatchView({
  video,
  reviews,
  relatedVideos,
}: VideoWatchViewProps) {
  const ratingAverage = getAverageRating(
    reviews.map((review) => review.rating),
  );
  const lessonContent = video.lesson.content || "";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-4 lg:gap-5">
        <VideoPlayer videoId={video._id} lesson={video.lesson} />
        <VideoDetailsHeader
          title={video.title}
          level={video.level}
          durationMinutes={video.lesson.duration}
          ratingAverage={ratingAverage}
          ratingCount={reviews.length}
        />
      </div>
      <div className="flex flex-col gap-8">
        {lessonContent && (
          <CourseSection title="Nội dung">
            <LessonNotes html={lessonContent} />
          </CourseSection>
        )}
        <CourseReviews
          reviews={reviews}
          ratingAverage={ratingAverage}
          action={
            <VideoRatingButton videoId={video._id} videoTitle={video.title} />
          }
        />
        <VideoComments lessonId={video.lesson._id} slug={video.slug} />
        {relatedVideos.length > 0 && (
          <CourseSection title="Video khác">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo._id} video={relatedVideo} />
              ))}
            </div>
          </CourseSection>
        )}
      </div>
    </div>
  );
}
