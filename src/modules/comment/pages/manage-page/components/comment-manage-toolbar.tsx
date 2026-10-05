import { FilterTabs, SearchInput } from "@/shared/components/common";
import { FilterTabItem } from "@/shared/types";
import { RefObject } from "react";
import {
  CommentCourseOption,
  CommentManageFilters,
  CommentManageTab,
} from "../../../types/comment-manage.types";
import { CommentCourseFilter } from "./comment-course-filter";

interface CommentManageToolbarProps {
  filters: CommentManageFilters;
  tabs: FilterTabItem<CommentManageTab>[];
  courses: CommentCourseOption[];
  onTabChange: (tab: CommentManageTab) => void;
  onCourseChange: (courseId: string) => void;
  onSearch: (keyword: string) => void;
  searchInputRef: RefObject<HTMLInputElement>;
  /** id của danh sách mà tab đang lọc */
  controlsId: string;
}

/**
 * Tab trạng thái bên trái, ô tìm và lọc khoá bên phải. Từ xl một hàng;
 * hẹp hơn thì tab một hàng, ô tìm một hàng. Dưới sm ô tìm lên đầu, dưới là
 * nút "Trạng thái:" và "Khoá học"
 */
export function CommentManageToolbar({
  filters,
  tabs,
  courses,
  onTabChange,
  onCourseChange,
  onSearch,
  searchInputRef,
  controlsId,
}: CommentManageToolbarProps) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      {/* flex-wrap: màn hẹp mà hai nút không vừa thì nút khoá học xuống hàng, không bóp chữ */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabs
          tabs={tabs}
          activeValue={filters.tab}
          onChange={onTabChange}
          controlsId={controlsId}
        />
        <CommentCourseFilter
          courses={courses}
          value={filters.courseId}
          onChange={onCourseChange}
          className="sm:hidden"
        />
      </div>
      <div className="order-first flex items-center gap-2 sm:order-none">
        <SearchInput
          ref={searchInputRef}
          value={filters.search}
          onSearch={onSearch}
          placeholder="Tìm trong nội dung bình luận"
          label="Tìm bình luận"
          className="flex-1 xl:w-72 xl:flex-none"
        />
        <CommentCourseFilter
          courses={courses}
          value={filters.courseId}
          onChange={onCourseChange}
          className="hidden sm:inline-flex"
        />
      </div>
    </div>
  );
}
