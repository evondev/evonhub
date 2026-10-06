import "server-only";

import { pusherServer } from "@/shared/libs/pusher";
import {
  NOTIFICATION_PUSHER_EVENT,
  PUSHER_MAX_CHANNELS_PER_TRIGGER,
} from "../constants/notification-type.constants";
import { getNotificationChannelName } from "../utils/notification-channel.utils";

/**
 * Báo "có thông báo mới" vào kênh private của từng người nhận để chuông cập nhật
 * ngay. Không gửi nội dung: client tự tải lại qua action đã kiểm quyền.
 * Chưa cấu hình Pusher thì bỏ qua, chuông vẫn cập nhật khi mở panel.
 * Lỗi Pusher không làm hỏng việc chính (thông báo đã ghi xong).
 */
export async function pingNotificationRecipients(userIds: string[]) {
  if (!pusherServer || userIds.length === 0) return;

  const channelNames = Array.from(new Set(userIds)).map(
    getNotificationChannelName,
  );
  const channelChunks: string[][] = [];

  for (
    let index = 0;
    index < channelNames.length;
    index += PUSHER_MAX_CHANNELS_PER_TRIGGER
  ) {
    channelChunks.push(
      channelNames.slice(index, index + PUSHER_MAX_CHANNELS_PER_TRIGGER),
    );
  }

  const pusher = pusherServer;

  try {
    await Promise.all(
      channelChunks.map((channelChunk) =>
        pusher.trigger(channelChunk, NOTIFICATION_PUSHER_EVENT, {}),
      ),
    );
  } catch (error) {
    console.log(error);
  }
}
