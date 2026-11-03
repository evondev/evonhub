import { cn } from "@/shared/utils";
import Link from "next/link";
import { VIDEO_LIST_VIEW_OPTIONS } from "../../../constants/video-list.constants";
import type {
  ExploreLinkBase,
  VideoListFilters,
  VideoListView,
} from "../../../types";
import {
  buildVideoListHref,
  withVideoListView,
} from "../../../utils/video-list.utils";

interface VideoViewToggleProps {
  view: VideoListView;
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
}

/**
 * Hai nút icon chuyển lưới, danh sách; giữ nguyên bộ lọc đang bật. Cùng kiểu rãnh
 * chìm, ô đang chọn nổi như thanh chọn kỳ ở trang Xếp hạng
 */
export function VideoViewToggle({
  view,
  filters,
  linkBase,
}: VideoViewToggleProps) {
  return (
    // Rãnh nằm trên nền trang xám nên dùng lớp phủ foreground/5, không bg-background
    <div className="inline-flex shrink-0 gap-1 rounded-xl bg-foreground/5 p-1 shadow-segment-track">
      {VIDEO_LIST_VIEW_OPTIONS.map((option) => {
        const isActive = option.view === view;
        const Icon = option.icon;

        return (
          <Link
            key={option.view}
            href={buildVideoListHref(
              withVideoListView(linkBase, option.view),
              filters,
            )}
            scroll={false}
            replace
            aria-label={option.label}
            aria-current={isActive ? "true" : undefined}
            title={option.label}
            className={cn(
              // Ô cao 36/32 + rãnh p-1 = 44/40, bằng ô tìm bên cạnh
              "grid size-9 place-items-center rounded-lg outline-none transition-[color,background-color,box-shadow] duration-150 focus-visible:ring-2 focus-visible:ring-primary/30 md:size-8",
              isActive && "bg-surface text-foreground shadow-segment-thumb",
              !isActive && "text-foreground/75 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
          </Link>
        );
      })}
    </div>
  );
}
