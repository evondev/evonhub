import { fetchVideos } from "@/modules/course/actions";
import { DASHBOARD_VIDEO_LIMIT } from "../constants";
import { VideoRailSection } from "./video-rail-section";

/** Đọc video mới nhất ở server, nằm trong Suspense riêng nên không giữ cả dashboard chờ */
export async function DashboardVideoSection() {
  const videos = await fetchVideos({
    search: "",
    isFree: false,
    categorySlug: "",
    limit: DASHBOARD_VIDEO_LIMIT,
  });

  return <VideoRailSection videos={videos} />;
}
