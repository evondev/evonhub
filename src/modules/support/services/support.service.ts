import "server-only";
import UserModel from "@/modules/user/models";
import { getNotificationChannelName } from "@/modules/notifications/utils/notification-channel.utils";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { pusherServer } from "@/shared/libs/pusher";
import { SUPPORT_PUSHER_EVENT } from "../constants";
import {
  SupportConversationItem,
  SupportMessageItem,
  SupportMessageModelProps,
  SupportPopulatedConversation,
  SupportPopulatedUser,
} from "../types";

/** Trường user cần cho hộp thư khi populate */
export const SUPPORT_USER_FIELDS = "name username email avatar status lock";

export function toSupportMessageItem(
  message: Pick<
    SupportMessageModelProps,
    "_id" | "isFromAdmin" | "content" | "createdAt"
  >,
): SupportMessageItem {
  return {
    id: message._id.toString(),
    isFromAdmin: message.isFromAdmin,
    content: message.content,
    createdAt: new Date(message.createdAt).toISOString(),
  };
}

function toSupportUserSummary(user: SupportPopulatedUser | null) {
  const isLocked = user?.status === UserStatus.Inactive;

  return {
    id: user?._id.toString() || "",
    // Tài khoản đã bị xoá khỏi DB: vẫn giữ hội thoại để tra lại
    name: user?.name || "Tài khoản đã xoá",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    isLocked,
    lockedUntil:
      isLocked && user?.lock?.until
        ? new Date(user.lock.until).toISOString()
        : null,
  };
}

export function toSupportConversationItem(
  conversation: SupportPopulatedConversation,
): SupportConversationItem {
  return {
    id: conversation._id.toString(),
    user: toSupportUserSummary(conversation.user),
    lastMessageAt: new Date(conversation.lastMessageAt).toISOString(),
    lastMessagePreview: conversation.lastMessagePreview,
    lastSenderIsAdmin: conversation.lastSenderIsAdmin,
    isUnreadByAdmin: conversation.isUnreadByAdmin,
  };
}

/**
 * Báo "có tin mới" lên kênh thông báo riêng của từng người nhận. Không mang
 * nội dung, client tự tải lại. Pusher lỗi thì người nhận thấy ở lần tải sau,
 * không báo lỗi cho người gửi
 */
export async function pingSupportRecipients(
  recipientIds: string[],
  conversationId: string,
): Promise<void> {
  if (!pusherServer || recipientIds.length === 0) return;

  await pusherServer
    .trigger(
      recipientIds.map((recipientId) =>
        getNotificationChannelName(recipientId),
      ),
      SUPPORT_PUSHER_EVENT,
      { conversationId },
    )
    .catch((error: unknown) => console.log("Pusher trigger error:", error));
}

/** Id các admin đang hoạt động, để báo khi học viên nhắn. Phải gọi connectToDatabase trước */
export async function findActiveAdminIds(): Promise<string[]> {
  const adminIds: unknown[] = await UserModel.find({
    role: UserRole.Admin,
    status: UserStatus.Active,
  }).distinct("_id");

  return adminIds.map((adminId) => String(adminId));
}
