import Link from "next/link";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { AnnouncedVideo } from "../types";
import { buildVideoPublicHref } from "@/modules/course/utils/course-manage.utils";

interface AnnouncedVideoLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  video: AnnouncedVideo;
}

/**
 * Bài là YouTube thì mở thẳng YouTube ở tab mới. Không có link YouTube thì về
 * trang video trên web. forwardRef để dùng được trong Button asChild
 */
export const AnnouncedVideoLink = forwardRef<
  HTMLAnchorElement,
  AnnouncedVideoLinkProps
>(function AnnouncedVideoLink({ video, ...anchorProps }, ref) {
  if (video.youtubeUrl) {
    return (
      <a
        ref={ref}
        href={video.youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        {...anchorProps}
      />
    );
  }

  return (
    <Link ref={ref} href={buildVideoPublicHref(video.slug)} {...anchorProps} />
  );
});
