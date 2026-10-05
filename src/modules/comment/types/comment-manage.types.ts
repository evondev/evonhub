import { CommentStatus } from "@/shared/constants/comment.constants";
import { BadgeTone } from "@/shared/types";

/** Tab trên trang Quản lý bình luận: ba trạng thái và "Tất cả" */
export type CommentManageTab = CommentStatus | "all";

/** Bộ lọc của trang Quản lý bình luận, lưu trên URL */
export interface CommentManageFilters {
  search: string;
  tab: CommentManageTab;
  /** Rỗng là mọi khoá */
  courseId: string;
  page: number;
}

/** Phần dữ liệu một bình luận mà danh sách cần */
export interface CommentManageRow {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: Date | string;
  author: {
    name: string;
    avatar?: string;
  };
  lesson: {
    id: string;
    title: string;
  };
  course: {
    slug: string;
    title: string;
  };
  /** Tên người được trả lời; bình luận gốc thì không có */
  replyToName?: string;
}

/** Số bình luận của từng tab, đã áp từ khoá và khoá học đang lọc */
export type CommentManageTabCounts = Record<CommentManageTab, number>;

export interface CommentManageResult {
  comments: CommentManageRow[];
  total: number;
  tabCounts: CommentManageTabCounts;
}

export interface CommentCourseOption {
  id: string;
  title: string;
}

export interface FetchCommentsManageParams {
  status?: CommentStatus;
  courseId?: string;
  page: number;
  limit: number;
  search?: string;
}

/** Bình luận như fetchCommentsManage trả về, đã populate người viết, bài, khoá, bình luận cha */
export interface CommentManageItemData {
  _id: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  user?: { name?: string; avatar?: string } | null;
  lesson?: {
    _id: string;
    title?: string;
    courseId?: { slug?: string; title?: string } | null;
  } | null;
  parentId?: { user?: { name?: string } | null } | null;
}

export interface FetchCommentsManageResult {
  comments: CommentManageItemData[];
  total: number;
  tabCounts: CommentManageTabCounts;
}

export interface UpdateCommentsStatusParams {
  commentIds: string[];
  status: CommentStatus;
}

export interface UpdateCommentsStatusResult {
  isSuccess: boolean;
  message?: string;
}

export type CommentManagePreviewState =
  "du-lieu" | "het-cho" | "rong" | "dang-tai" | "loi";

export interface CommentManagePreviewStateLink {
  state: CommentManagePreviewState;
  label: string;
}

/** Một thao tác đang chạy: dòng nào đang đổi sang trạng thái nào */
export interface CommentPendingChange {
  commentIds: string[];
  status: CommentStatus;
}

export interface CommentStatusBadge {
  tone: BadgeTone;
  label: string;
}
