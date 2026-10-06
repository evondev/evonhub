import "server-only";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { getCurrentUser } from "@/shared/libs/auth";
import { ChatMessageItem, ChatMessageModelProps, ChatViewer } from "../types";

const CHAT_MODERATOR_ROLES: string[] = [UserRole.Admin, UserRole.Expert];

export function toChatMessageItem(
  message: ChatMessageModelProps,
): ChatMessageItem {
  return {
    _id: message._id.toString(),
    clientId: message.clientId,
    sender: {
      userId: message.sender.user.toString(),
      name: message.sender.name,
      username: message.sender.username,
      avatar: message.sender.avatar,
      role: message.sender.role,
    },
    content: message.content,
    createdAt: new Date(message.createdAt).toISOString(),
  };
}

/** Người đang đăng nhập dưới dạng thành viên chat; null nếu là khách hoặc bị khoá */
export async function getChatViewer(): Promise<ChatViewer | null> {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.status === UserStatus.Inactive) return null;

  return {
    userId: currentUser._id.toString(),
    name: currentUser.name || "",
    username: currentUser.username || "",
    avatar: currentUser.avatar || "",
    role: currentUser.role,
    isModerator: CHAT_MODERATOR_ROLES.includes(currentUser.role),
  };
}
