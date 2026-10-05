import { RatingStatus } from "@/shared/constants/rating.constants";
import { FilterTabItem, ModerationAction } from "@/shared/types";
import { formatThoundsand } from "@/shared/utils";
import {
  RATING_MANAGE_TABS,
  RATING_REACTIONS,
} from "../constants/rating-manage.constants";
import {
  RatingManageFilters,
  RatingManageItemData,
  RatingManageRow,
  RatingManageTab,
  RatingManageTabCounts,
  RatingReaction,
} from "../types/rating-manage.types";

export function toRatingManageRow(
  rating: RatingManageItemData,
): RatingManageRow {
  return {
    id: rating._id.toString(),
    content: rating.content || "",
    rating: rating.rating,
    status: rating.status,
    createdAt: rating.createdAt,
    author: {
      name: rating.user?.name || "Người dùng đã xoá",
      avatar: rating.user?.avatar,
    },
    course: {
      slug: rating.course?.slug || "",
      title: rating.course?.title || "Khoá học đã xoá",
    },
  };
}

/** Tab "Tất cả" không lọc trạng thái, các tab khác lọc đúng trạng thái của nó */
export function getRatingStatusForTab(
  tab: RatingManageTab,
): RatingStatus | undefined {
  return tab === "all" ? undefined : tab;
}

/** Duyệt là "Đã duyệt" (hiện trên trang khoá), từ chối là ẩn hẳn */
export function getRatingStatusForAction(
  action: ModerationAction,
): RatingStatus {
  return action === "approve" ? RatingStatus.Active : RatingStatus.Rejected;
}

export function canApproveRating(rating: RatingManageRow): boolean {
  return rating.status !== RatingStatus.Active;
}

export function canRejectRating(rating: RatingManageRow): boolean {
  return rating.status !== RatingStatus.Rejected;
}

/** Số sao ngoài 1–5 (dữ liệu cũ) thì không có icon */
export function getRatingReaction(rating: number): RatingReaction | undefined {
  return RATING_REACTIONS[rating];
}

export function buildRatingCourseHref(rating: RatingManageRow): string {
  return `/course/${rating.course.slug}`;
}

export function buildRatingSuccessMessage(
  ratings: RatingManageRow[],
  action: ModerationAction,
): string {
  const verb = action === "approve" ? "duyệt" : "từ chối";

  if (ratings.length === 1) {
    return `Đã ${verb} đánh giá của ${ratings[0].author.name}`;
  }

  return `Đã ${verb} ${ratings.length} đánh giá`;
}

export function buildRatingCountSuccessMessage(
  count: number,
  action: ModerationAction,
): string {
  const verb = action === "approve" ? "duyệt" : "từ chối";

  return `Đã ${verb} ${formatThoundsand(count)} đánh giá`;
}

export function buildRatingPurgeSuccessMessage(count: number): string {
  return `Đã xoá vĩnh viễn ${formatThoundsand(count)} đánh giá`;
}

/** Duyệt được khi tab không phải "Đã duyệt" (chọn cả bộ lọc thì không có từng dòng để xét) */
export function canApproveRatingTab(tab: RatingManageTab): boolean {
  return tab !== RatingStatus.Active;
}

export function canRejectRatingTab(tab: RatingManageTab): boolean {
  return tab !== RatingStatus.Rejected;
}

/** Gắn số đếm vào tab; chưa có số (lần tải đầu) thì tab chỉ ghi chữ */
export function buildRatingManageTabs(
  tabCounts?: RatingManageTabCounts,
): FilterTabItem<RatingManageTab>[] {
  return RATING_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

/** Trang xem trước lọc tại chỗ trên danh sách giả, như server sẽ lọc */
export function filterPreviewRatings(
  ratings: RatingManageRow[],
  filters: RatingManageFilters,
  courseTitleById: Record<string, string>,
): RatingManageRow[] {
  const keyword = filters.search.trim().toLowerCase();
  const status = getRatingStatusForTab(filters.tab);
  const courseTitle = courseTitleById[filters.courseId];

  return ratings.filter((rating) => {
    const isKeywordMatch =
      !keyword || rating.content.toLowerCase().includes(keyword);
    const isStatusMatch = !status || rating.status === status;
    const isCourseMatch = !courseTitle || rating.course.title === courseTitle;

    return isKeywordMatch && isStatusMatch && isCourseMatch;
  });
}

/** Số đếm từng tab của trang xem trước, tính trên danh sách giả như server sẽ đếm */
export function countPreviewRatingTabs(
  ratings: RatingManageRow[],
  filters: RatingManageFilters,
  courseTitleById: Record<string, string>,
): RatingManageTabCounts {
  function countTab(tab: RatingManageTab) {
    return filterPreviewRatings(ratings, { ...filters, tab }, courseTitleById)
      .length;
  }

  return {
    [RatingStatus.Inactive]: countTab(RatingStatus.Inactive),
    [RatingStatus.Active]: countTab(RatingStatus.Active),
    [RatingStatus.Rejected]: countTab(RatingStatus.Rejected),
    all: countTab("all"),
  };
}
