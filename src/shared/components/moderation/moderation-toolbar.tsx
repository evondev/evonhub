import { FilterTabs, SearchInput } from "@/shared/components/common";
import { CourseFilterOption, FilterTabItem } from "@/shared/types";
import { RefObject } from "react";
import { CourseFilter } from "./course-filter";

interface ModerationToolbarProps<TTab extends string> {
  tabs: FilterTabItem<TTab>[];
  activeTab: TTab;
  search: string;
  courses: CourseFilterOption[];
  /** Rỗng là mọi khoá */
  courseId: string;
  searchPlaceholder: string;
  searchLabel: string;
  onTabChange: (tab: TTab) => void;
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
export function ModerationToolbar<TTab extends string>({
  tabs,
  activeTab,
  search,
  courses,
  courseId,
  searchPlaceholder,
  searchLabel,
  onTabChange,
  onCourseChange,
  onSearch,
  searchInputRef,
  controlsId,
}: ModerationToolbarProps<TTab>) {
  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      {/* flex-wrap: màn hẹp mà hai nút không vừa thì nút khoá học xuống hàng, không bóp chữ */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabs
          tabs={tabs}
          activeValue={activeTab}
          onChange={onTabChange}
          controlsId={controlsId}
        />
        <CourseFilter
          courses={courses}
          value={courseId}
          onChange={onCourseChange}
          className="sm:hidden"
        />
      </div>
      <div className="order-first flex items-center gap-2 sm:order-none">
        <SearchInput
          ref={searchInputRef}
          value={search}
          onSearch={onSearch}
          placeholder={searchPlaceholder}
          label={searchLabel}
          className="flex-1 xl:w-72 xl:flex-none"
        />
        <CourseFilter
          courses={courses}
          value={courseId}
          onChange={onCourseChange}
          className="hidden sm:inline-flex"
        />
      </div>
    </div>
  );
}
