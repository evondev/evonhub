import { LoadErrorState } from "@/shared/components/common";
import { fetchVideos } from "../../../actions";
import { VIDEO_LIST_LIMIT } from "../../../constants/video-list.constants";
import type { ExploreLinkBase, VideoListFilters } from "../../../types";
import { VideoListResults } from "./video-list-results";

interface VideoListLoaderProps {
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
}

export async function VideoListLoader({
  filters,
  linkBase,
}: VideoListLoaderProps) {
  const videos = await fetchVideos({ ...filters, limit: VIDEO_LIST_LIMIT });

  if (!videos) return <LoadErrorState title="Chưa tải được danh sách video" />;

  return (
    <VideoListResults videos={videos} filters={filters} linkBase={linkBase} />
  );
}
