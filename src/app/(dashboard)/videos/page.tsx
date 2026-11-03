import { VideoListPage } from "@/modules/course/pages";
import type { VideoListSearchParams } from "@/modules/course/types";
import {
  parseVideoListFilters,
  parseVideoListView,
} from "@/modules/course/utils/video-list.utils";
import { Metadata } from "next";

interface VideoListRouteProps {
  searchParams: VideoListSearchParams;
}

export const metadata: Metadata = {
  title: "Video",
  description: "Video ngắn chia sẻ kiến thức lập trình, có video miễn phí xem ngay không cần đăng nhập.",
};

export default function VideoListRoute({ searchParams }: VideoListRouteProps) {
  return (
    <VideoListPage
      filters={parseVideoListFilters(searchParams)}
      view={parseVideoListView(searchParams)}
    />
  );
}
