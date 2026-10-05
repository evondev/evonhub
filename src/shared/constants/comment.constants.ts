export enum CommentStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

// Trả lời lồng tối đa tới tầng 4: bình luận level 0–3 còn trả lời được
export const MAX_REPLY_LEVEL = 3;
