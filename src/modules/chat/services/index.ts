import "server-only";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { getCurrentUser } from "@/shared/libs/auth";
import { pusherServer } from "@/shared/libs/pusher";
import UserModel from "@/modules/user/models";
import { isValidObjectId } from "mongoose";
import { CHAT_CHANNEL_NAME, CHAT_HOST_ROLES } from "../constants";
import ChatMessageModel from "../models";
import {
  ChatHost,
  ChatMessageItem,
  ChatMessageModelProps,
  ChatPresence,
  ChatViewer,
  PusherChannelUsers,
} from "../types";
import { getVietnamStartOfDay } from "../utils";

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

const EMPTY_CHAT_PRESENCE: ChatPresence = { onlineCount: 0, host: null };

/**
 * Ai đang mở trang chat: hỏi thẳng Pusher danh sách id, rồi tìm trong đó một
 * admin để mời học viên vào. Chưa cấu hình hoặc lỗi thì coi như phòng trống.
 * Phải gọi connectToDatabase trước
 */
export async function getChatPresence(): Promise<ChatPresence> {
  if (!pusherServer) return EMPTY_CHAT_PRESENCE;

  try {
    const response = await pusherServer.get({
      path: `/channels/${CHAT_CHANNEL_NAME}/users`,
    });

    if (!response.ok) return EMPTY_CHAT_PRESENCE;

    const { users } = (await response.json()) as PusherChannelUsers;
    const memberIds = users
      .map((member) => member.id)
      .filter((memberId) => isValidObjectId(memberId));

    if (memberIds.length === 0) return EMPTY_CHAT_PRESENCE;

    const hostUser = await UserModel.findOne({
      _id: { $in: memberIds },
      role: { $in: CHAT_HOST_ROLES },
      status: { $ne: UserStatus.Inactive },
    })
      .select({ name: 1, avatar: 1 })
      .lean<ChatHost>();

    return {
      onlineCount: users.length,
      host: hostUser
        ? { name: hostUser.name || "", avatar: hostUser.avatar || "" }
        : null,
    };
  } catch (error) {
    console.log("getChatPresence error:", error);

    return EMPTY_CHAT_PRESENCE;
  }
}

/** Giờ tin mới nhất hôm nay theo giờ VN. Phải gọi connectToDatabase trước */
export async function getLatestChatMessageAt(): Promise<string | null> {
  const latestMessage = await ChatMessageModel.findOne({
    createdAt: { $gte: getVietnamStartOfDay() },
  })
    .sort({ createdAt: -1 })
    .select({ createdAt: 1 })
    .lean<Pick<ChatMessageModelProps, "createdAt">>();

  return latestMessage ? new Date(latestMessage.createdAt).toISOString() : null;
}
