import { CommentStatus } from "@/shared/constants/comment.constants";
import { FilterTabItem } from "@/shared/types";
import { timeAgo } from "@/shared/utils";
import dayjs from "dayjs";
import {
  COMMENT_CONTENT_CLAMP_MIN_LENGTH,
  COMMENT_MANAGE_TABS,
  COMMENT_STALE_PENDING_HOURS,
} from "../constants/comment-manage.constants";
import {
  CommentManageFilters,
  CommentManageItemData,
  CommentManageRow,
  CommentManageTab,
  CommentManageTabCounts,
} from "../types/comment-manage.types";

export function toCommentManageRow(
  comment: CommentManageItemData,
): CommentManageRow {
  return {
    id: comment._id.toString(),
    content: comment.content,
    status: comment.status,
    createdAt: comment.createdAt,
    author: {
      name: comment.user?.name || "Người dùng đã xoá",
      avatar: comment.user?.avatar,
    },
    lesson: {
      id: comment.lesson?._id?.toString() || "",
      title: comment.lesson?.title || "Bài học đã xoá",
    },
    course: {
      slug: comment.lesson?.courseId?.slug || "",
      title: comment.lesson?.courseId?.title || "",
    },
    replyToName: comment.parentId?.user?.name,
  };
}

/** Tab "Tất cả" không lọc trạng thái, các tab khác lọc đúng trạng thái của nó */
export function getCommentStatusForTab(
  tab: CommentManageTab,
): CommentStatus | undefined {
  return tab === "all" ? undefined : tab;
}

/** Mở bình luận ngay trong bài học, cuộn tới đúng bình luận */
export function buildCommentLessonHref(comment: CommentManageRow): string {
  return `/${comment.course.slug}/lesson?id=${comment.lesson.id}#${comment.id}`;
}

/** Bình luận chờ quá lâu thì cần chú ý: người hỏi đang đợi trả lời */
export function isStalePendingComment(comment: CommentManageRow): boolean {
  if (comment.status !== CommentStatus.Pending) return false;

  return (
    dayjs().diff(dayjs(comment.createdAt), "hour") >=
    COMMENT_STALE_PENDING_HOURS
  );
}

/** "2 giờ trước"; chờ quá lâu thì nói thẳng "Chờ 3 ngày" */
export function formatCommentAge(comment: CommentManageRow): string {
  if (!isStalePendingComment(comment)) return timeAgo(comment.createdAt);

  return `Chờ ${dayjs().diff(dayjs(comment.createdAt), "day")} ngày`;
}

export function formatCommentFullDate(date: Date | string): string {
  return dayjs(date).format("HH:mm, DD/MM/YYYY");
}

/** Nội dung ngắn thì hiện hết, không cần nút "Xem thêm" */
export function isLongCommentContent(content: string): boolean {
  return (
    content.length > COMMENT_CONTENT_CLAMP_MIN_LENGTH || content.includes("\n")
  );
}

/** Gắn số đếm vào tab; chưa có số (lần tải đầu) thì tab chỉ ghi chữ */
export function buildCommentManageTabs(
  tabCounts?: CommentManageTabCounts,
): FilterTabItem<CommentManageTab>[] {
  return COMMENT_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

/** Trang xem trước lọc tại chỗ trên danh sách giả, như server sẽ lọc */
export function filterPreviewComments(
  comments: CommentManageRow[],
  filters: CommentManageFilters,
  courseTitleById: Record<string, string>,
): CommentManageRow[] {
  const keyword = filters.search.trim().toLowerCase();
  const status = getCommentStatusForTab(filters.tab);
  const courseTitle = courseTitleById[filters.courseId];

  return comments.filter((comment) => {
    const isKeywordMatch =
      !keyword || comment.content.toLowerCase().includes(keyword);
    const isStatusMatch = !status || comment.status === status;
    const isCourseMatch = !courseTitle || comment.course.title === courseTitle;

    return isKeywordMatch && isStatusMatch && isCourseMatch;
  });
}

/** Số đếm từng tab của trang xem trước, tính trên danh sách giả như server sẽ đếm */
export function countPreviewCommentTabs(
  comments: CommentManageRow[],
  filters: CommentManageFilters,
  courseTitleById: Record<string, string>,
): CommentManageTabCounts {
  function countTab(tab: CommentManageTab) {
    return filterPreviewComments(comments, { ...filters, tab }, courseTitleById)
      .length;
  }

  return {
    [CommentStatus.Pending]: countTab(CommentStatus.Pending),
    [CommentStatus.Approved]: countTab(CommentStatus.Approved),
    [CommentStatus.Rejected]: countTab(CommentStatus.Rejected),
    all: countTab("all"),
  };
}
