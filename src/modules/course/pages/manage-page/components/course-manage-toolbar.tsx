import { Button } from "@/components/ui/button";
import { FilterTabs, SearchInput } from "@/shared/components/common";
import { FilterTabItem } from "@/shared/types";
import { Clapperboard, Plus } from "lucide-react";
import Link from "next/link";
import { RefObject } from "react";
import {
  COURSE_ADD_NEW_PATH,
  VIDEO_ADD_NEW_PATH,
} from "../../../constants/course-manage.constants";
import {
  CourseManageFilters,
  CourseManageTab,
} from "../../../types/course-manage.types";
import { CourseFilterChip } from "./course-filter-chip";

interface CourseManageToolbarProps {
  filters: CourseManageFilters;
  tabs: FilterTabItem<CourseManageTab>[];
  onTabChange: (tab: CourseManageTab) => void;
  onFreeToggle: () => void;
  onVideoToggle: () => void;
  onSearch: (keyword: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  /** id của bảng mà tab đang lọc */
  controlsId: string;
  /** Chỉ admin tạo được video lẻ */
  canAddVideo: boolean;
}

/**
 * Tab trạng thái và chip "Miễn phí", "Video" bên trái, ô tìm và nút thêm bên phải. Từ 2xl
 * một hàng (bốn tab có số cần ~540px, hẹp hơn thì tab bị bóp xuống dòng); hẹp
 * hơn thì lọc một hàng, ô tìm một hàng. Dưới sm ô tìm lên đầu, tab thành nút
 * "Trạng thái:"
 */
export function CourseManageToolbar({
  filters,
  tabs,
  onTabChange,
  onFreeToggle,
  onVideoToggle,
  onSearch,
  searchInputRef,
  controlsId,
  canAddVideo,
}: CourseManageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
      <div className="flex items-center gap-2">
        <FilterTabs
          tabs={tabs}
          activeValue={filters.tab}
          onChange={onTabChange}
          controlsId={controlsId}
        />
        {/* Vạch chia: tab chọn một, chip bật thêm, hai nhóm khác việc */}
        <span
          aria-hidden="true"
          className="mx-1 hidden h-5 w-px bg-foreground/10 sm:block"
        />
        <CourseFilterChip
          label="Miễn phí"
          isActive={filters.isFree}
          onToggle={onFreeToggle}
        />
        <CourseFilterChip
          label="Video"
          isActive={filters.isVideo}
          onToggle={onVideoToggle}
        />
      </div>
      <div className="order-first flex items-center gap-2 sm:order-none">
        <SearchInput
          ref={searchInputRef}
          value={filters.search}
          onSearch={onSearch}
          placeholder="Tìm tên khóa học"
          label="Tìm khóa học"
          className="flex-1 2xl:w-72 2xl:flex-none"
        />
        {canAddVideo && (
          <Button
            asChild
            variant="outline"
            className="h-11 shrink-0 px-3.5 sm:px-4 md:h-10"
          >
            <Link href={VIDEO_ADD_NEW_PATH} aria-label="Thêm video">
              <Clapperboard className="size-4" />
              {/* Dưới sm chỉ còn icon để ô tìm còn chỗ */}
              <span className="hidden sm:inline">Thêm video</span>
            </Link>
          </Button>
        )}
        <Button
          asChild
          variant="primary"
          className="h-11 shrink-0 px-3.5 sm:px-4 md:h-10"
        >
          <Link href={COURSE_ADD_NEW_PATH}>
            <Plus className="size-4" />
            {/* Dưới sm chữ ngắn để ô tìm còn đủ chỗ cho placeholder */}
            <span className="sm:hidden">Thêm</span>
            <span className="hidden sm:inline">Thêm khóa học</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
