import { fetchRatingsByCourse } from "@/modules/rating/actions";
import { notFound } from "next/navigation";
import { fetchVideoDetails, fetchVideos } from "../../actions";
import { RELATED_VIDEO_COUNT } from "../../constants/video-list.constants";
import { incrementCourseViews } from "../../services/course-views.service";
import { VideoLockedView } from "./components/video-locked-view";
import { VideoWatchView } from "./components/video-watch-view";

export interface VideoDetailsPageProps {
  slug: string;
}

/** Đọc video, đánh giá trên server; người chưa có quyền xem nhận bản đã cắt video và nội dung */
export async function VideoDetailsPage({ slug }: VideoDetailsPageProps) {
  const [video] = await Promise.all([
    fetchVideoDetails(slug),
    incrementCourseViews(slug),
  ]);

  if (!video) notFound();

  const [reviews = [], latestVideos = []] = await Promise.all([
    fetchRatingsByCourse({ courseId: video._id }),
    // Chỉ trang đang xem có khối "Video khác"; lấy dư một để bỏ chính video này
    video.canWatch
      ? fetchVideos({ search: "", isFree: false, limit: RELATED_VIDEO_COUNT + 1 })
      : undefined,
  ]);

  if (video.canWatch) {
    const relatedVideos = latestVideos
      .filter((relatedVideo) => relatedVideo._id !== video._id)
      .slice(0, RELATED_VIDEO_COUNT);

    return (
      <VideoWatchView
        video={video}
        reviews={reviews}
        relatedVideos={relatedVideos}
      />
    );
  }

  return <VideoLockedView video={video} reviews={reviews} />;
}
