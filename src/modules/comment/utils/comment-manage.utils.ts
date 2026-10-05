import { CommentStatus } from "@/shared/constants/comment.constants";
import { FilterTabItem, ModerationAction } from "@/shared/types";
import { formatThoundsand } from "@/shared/utils";
import { COMMENT_MANAGE_TABS } from "../constants/comment-manage.constants";
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

/** Duyệt là "Đã duyệt", từ chối là "Từ chối" */
export function getCommentStatusForAction(
  action: ModerationAction,
): CommentStatus {
  return action === "approve" ? CommentStatus.Approved : CommentStatus.Rejected;
}

export function canApproveComment(comment: CommentManageRow): boolean {
  return comment.status !== CommentStatus.Approved;
}

export function canRejectComment(comment: CommentManageRow): boolean {
  return comment.status !== CommentStatus.Rejected;
}

export function buildCommentSuccessMessage(
  comments: CommentManageRow[],
  action: ModerationAction,
): string {
  const verb = action === "approve" ? "duyệt" : "từ chối";

  if (comments.length === 1) {
    return `Đã ${verb} bình luận của ${comments[0].author.name}`;
  }

  return `Đã ${verb} ${comments.length} bình luận`;
}

export function buildCommentCountSuccessMessage(
  count: number,
  action: ModerationAction,
): string {
  const verb = action === "approve" ? "duyệt" : "từ chối";

  return `Đã ${verb} ${formatThoundsand(count)} bình luận`;
}

export function buildCommentPurgeSuccessMessage(count: number): string {
  return `Đã xoá vĩnh viễn ${formatThoundsand(count)} bình luận`;
}

/** Duyệt được khi tab không phải "Đã duyệt" (chọn cả bộ lọc thì không có từng dòng để xét) */
export function canApproveCommentTab(tab: CommentManageTab): boolean {
  return tab !== CommentStatus.Approved;
}

export function canRejectCommentTab(tab: CommentManageTab): boolean {
  return tab !== CommentStatus.Rejected;
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
