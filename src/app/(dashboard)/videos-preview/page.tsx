import { PREVIEW_VIDEO_LIST_STATE_LINKS } from "@/modules/course/constants/video-list.constants";
import { VideoListPreviewPage } from "@/modules/course/pages";
import type {
  VideoListPreviewState,
  VideoListSearchParams,
} from "@/modules/course/types";
import { parseVideoListFilters } from "@/modules/course/utils/video-list.utils";
import { notFound } from "next/navigation";

interface VideoListPreviewRouteProps {
  searchParams: VideoListSearchParams & { tt?: string };
}

export default function VideoListPreviewRoute({
  searchParams,
}: VideoListPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_VIDEO_LIST_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: VideoListPreviewState = matchedState?.state || "du-lieu";

  return (
    <VideoListPreviewPage
      state={state}
      filters={parseVideoListFilters(searchParams)}
    />
  );
}
