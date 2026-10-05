/** Hai việc trên trang duyệt (bình luận, đánh giá): duyệt hoặc từ chối */
export type ModerationAction = "approve" | "reject";

/** Một thao tác đang chạy: những mục nào đang được duyệt hay từ chối */
export interface ModerationPendingChange {
  itemIds: string[];
  action: ModerationAction;
  /** Đang đổi mọi mục khớp bộ lọc (trừ mục bỏ tick), không phải danh sách id */
  isAllMatching: boolean;
}

export interface ModerationResult {
  isSuccess: boolean;
  message?: string;
  /** Số mục đã đổi hay đã xoá, cho câu toast của thao tác theo bộ lọc */
  count?: number;
}

/** Bộ lọc đang xem (trừ tab trạng thái): thao tác "tất cả" áp đúng phạm vi này */
export interface ModerationScope {
  search?: string;
  /** Rỗng là mọi khoá */
  courseId?: string;
}

/** Một khoá trong bộ lọc "Khoá học" */
export interface CourseFilterOption {
  id: string;
  title: string;
}
