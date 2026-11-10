import { Document, Schema } from "mongoose";

export interface FeedbackModelProps extends Document {
  user: Schema.Types.ObjectId;
  /** Khoá học người dùng muốn có */
  courseWish: string;
  /** Tính năng người dùng muốn có */
  featureWish: string;
  /** Nghĩ sao về các khoá học AI / vibe coding */
  aiCourseOpinion: string;
  /** Muốn cải thiện tiếng Anh giao tiếp không; bỏ trống là không trả lời */
  wantsEnglish?: boolean;
  createdAt: Date;
}

export interface FeedbackFormValues {
  courseWish: string;
  featureWish: string;
  aiCourseOpinion: string;
  wantsEnglish?: boolean;
}

export interface FeedbackEnglishOption {
  value: boolean;
  /** Chữ trên nút chọn trong form */
  label: string;
  /** Chữ hiện ở trang admin */
  adminLabel: string;
}

export interface CreateFeedbackResult {
  isSuccess: boolean;
  message?: string;
}

export interface MyFeedbackStatus {
  hasSubmitted: boolean;
}

export interface FetchFeedbacksParams {
  search?: string;
  page?: number;
  limit?: number;
}

/** Một góp ý từ server, user đã populate (null khi tài khoản đã bị xoá) */
export interface FeedbackItemData {
  _id: string;
  user?: {
    name?: string;
    username?: string;
    email?: string;
    avatar?: string;
  } | null;
  courseWish: string;
  featureWish: string;
  aiCourseOpinion?: string;
  wantsEnglish?: boolean;
  createdAt: string;
}

export interface FetchFeedbacksResult {
  feedbacks: FeedbackItemData[];
  total: number;
}

export interface DeleteFeedbackResult {
  isSuccess: boolean;
}

/** Một dòng đã dựng sẵn để hiển thị ở trang admin */
export interface FeedbackRow {
  id: string;
  userName: string;
  userAvatar?: string;
  userProfileHref: string;
  courseWish: string;
  featureWish: string;
  aiCourseOpinion: string;
  /** Câu trả lời tiếng Anh giao tiếp đã dịch ra chữ, rỗng khi không trả lời */
  englishAnswer: string;
  createdAt: string;
}

export interface FeedbackManageFilters {
  search: string;
  page: number;
}

export interface FeedbackManageResult {
  feedbacks: FeedbackRow[];
  total: number;
}
