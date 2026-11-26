import type { VideoListItem } from "@/modules/course/types";
import type { Types } from "mongoose";

/** Video đọc thẳng từ DB, chưa có thời lượng và mô tả ngắn như ở danh sách */
export interface AnnouncedVideoRow
  extends Omit<VideoListItem, "_id" | "duration" | "excerpt"> {
  _id: Types.ObjectId;
}

/** Bài duy nhất của video: lấy thời lượng, và link YouTube khi chưa có ảnh bìa */
export interface AnnouncedVideoLesson {
  duration?: number;
  iframe?: string;
}

/** Video trong hộp thông báo, kèm link xem trên YouTube */
export interface AnnouncedVideo extends VideoListItem {
  /** Link YouTube của bài; rỗng khi bài không dùng YouTube */
  youtubeUrl: string;
}
