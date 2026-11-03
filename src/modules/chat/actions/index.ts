"use server";

import { connectToDatabase } from "@/shared/libs";
import { pusherServer } from "@/shared/libs/pusher";
import { FilterQuery, isValidObjectId } from "mongoose";
import { unstable_cache } from "next/cache";
import {
  CHAT_ACTIVITY_CACHE_SECONDS,
  CHAT_ACTIVITY_CHANNEL_NAME,
  CHAT_ACTIVITY_EVENT,
  CHAT_CHANNEL_NAME,
  CHAT_DELETE_ERROR_MESSAGE,
  CHAT_EVENTS,
  CHAT_FORBIDDEN_MESSAGE,
  CHAT_PAGE_SIZE,
  CHAT_RATE_LIMIT_MESSAGE,
  CHAT_SEND_ERROR_MESSAGE,
  CHAT_SEND_INTERVAL_MS,
  CHAT_SIGN_IN_REQUIRED_MESSAGE,
  CHAT_SYNC_LIMIT,
} from "../constants";
import ChatMessageModel from "../models";
import {
  getChatPresence,
  getChatViewer,
  getLatestChatMessageAt,
  toChatMessageItem,
} from "../services";
import {
  ChatActivity,
  ChatActivityEventPayload,
  ChatMessageDeletedPayload,
  ChatMessageModelProps,
  DeleteChatMessageResult,
  FetchChatMessagesParams,
  FetchChatMessagesResult,
  SendChatMessageParams,
  SendChatMessageResult,
} from "../types";
import {
  getChatContentError,
  getNextVietnamMidnight,
  getVietnamStartOfDay,
} from "../utils";

const CLIENT_ID_MAX_LENGTH = 64;

const EMPTY_CHAT_ACTIVITY: ChatActivity = {
  onlineCount: 0,
  host: null,
  lastMessageAt: null,
};

// Mọi tab của mọi người dùng chung một kết quả: cả trang chỉ tốn một lần gọi
// Pusher và DB trong mỗi khoảng cache, không nhân theo số người đang mở web
const getCachedChatActivity = unstable_cache(
  async (): Promise<ChatActivity> => {
    await connectToDatabase();

    const [presence, lastMessageAt] = await Promise.all([
      getChatPresence(),
      getLatestChatMessageAt(),
    ]);

    return { ...presence, lastMessageAt };
  },
  ["chat-activity"],
  { revalidate: CHAT_ACTIVITY_CACHE_SECONDS },
);

/**
 * Tin hôm nay theo giờ VN, xếp cũ đến mới. `before` lấy trang cũ hơn khi kéo
 * lên, `after` lấy bù tin bị lỡ khi mất kết nối. Khách không đọc được.
 */
export async function fetchChatMessages(
  params: FetchChatMessagesParams = {},
): Promise<FetchChatMessagesResult | undefined> {
  try {
    const viewer = await getChatViewer();

    if (!viewer) return undefined;

    await connectToDatabase();

    const { before, after } = params;
    const query: FilterQuery<ChatMessageModelProps> = {
      createdAt: { $gte: getVietnamStartOfDay() },
    };

    if (after && isValidObjectId(after)) {
      query._id = { $gt: after };

      const missedMessages = await ChatMessageModel.find(query)
        .sort({ _id: 1 })
        .limit(CHAT_SYNC_LIMIT)
        .lean<ChatMessageModelProps[]>();

      return {
        messages: missedMessages.map(toChatMessageItem),
        hasMore: false,
      };
    }

    if (before && isValidObjectId(before)) query._id = { $lt: before };

    // Lấy dư một tin để biết còn trang trước không
    const latestMessages = await ChatMessageModel.find(query)
      .sort({ _id: -1 })
      .limit(CHAT_PAGE_SIZE + 1)
      .lean<ChatMessageModelProps[]>();

    const hasMore = latestMessages.length > CHAT_PAGE_SIZE;
    const pageMessages = latestMessages.slice(0, CHAT_PAGE_SIZE).reverse();

    return { messages: pageMessages.map(toChatMessageItem), hasMore };
  } catch (error) {
    console.log("fetchChatMessages error:", error);
  }
}

/**
 * Tình hình phòng chat cho mục Trò chuyện trên menu và bong bóng mời vào chat.
 * Khách cũng đọc được: chỉ có số người, mốc giờ và tên, ảnh của admin đang
 * trong phòng, không lộ tin nhắn.
 */
export async function fetchChatActivity(): Promise<ChatActivity> {
  try {
    return await getCachedChatActivity();
  } catch (error) {
    console.log("fetchChatActivity error:", error);

    return EMPTY_CHAT_ACTIVITY;
  }
}

export async function sendChatMessage(
  params: SendChatMessageParams,
): Promise<SendChatMessageResult> {
  try {
    const viewer = await getChatViewer();

    if (!viewer) return { error: CHAT_SIGN_IN_REQUIRED_MESSAGE };

    const { clientId, content } = params;

    if (
      typeof clientId !== "string" ||
      !clientId ||
      clientId.length > CLIENT_ID_MAX_LENGTH ||
      typeof content !== "string"
    ) {
      return { error: CHAT_SEND_ERROR_MESSAGE };
    }

    const contentError = getChatContentError(content);

    if (contentError) return { error: contentError };

    await connectToDatabase();

    const now = new Date();
    const recentMessage = await ChatMessageModel.exists({
      "sender.user": viewer.userId,
      createdAt: { $gt: new Date(now.getTime() - CHAT_SEND_INTERVAL_MS) },
    });

    if (recentMessage) return { error: CHAT_RATE_LIMIT_MESSAGE };

    const createdMessage = await ChatMessageModel.create({
      clientId,
      sender: {
        user: viewer.userId,
        name: viewer.name,
        username: viewer.username,
        avatar: viewer.avatar,
        role: viewer.role,
      },
      content: content.trim(),
      createdAt: now,
      expireAt: getNextVietnamMidnight(now),
    });
    const message = toChatMessageItem(createdMessage.toObject());
    const activityPayload: ChatActivityEventPayload = {
      lastMessageAt: message.createdAt,
    };

    // Tin đã lưu: Pusher lỗi thì người khác nhận bù ở lần đồng bộ sau, không
    // báo lỗi gửi cho người viết. Gộp một lần gọi: tin cho người trong phòng,
    // mốc giờ cho menu của người đang ở trang khác
    await pusherServer
      ?.triggerBatch([
        {
          channel: CHAT_CHANNEL_NAME,
          name: CHAT_EVENTS.MESSAGE_NEW,
          data: message,
        },
        {
          channel: CHAT_ACTIVITY_CHANNEL_NAME,
          name: CHAT_ACTIVITY_EVENT,
          data: activityPayload,
        },
      ])
      .catch((error: unknown) => console.log("Pusher trigger error:", error));

    return { message };
  } catch (error) {
    console.log("sendChatMessage error:", error);

    return { error: CHAT_SEND_ERROR_MESSAGE };
  }
}

/**
 * Gỡ tin: ai cũng gỡ được tin của mình, Admin/Expert gỡ được mọi tin. Mọi
 * người đang xem thấy tin biến mất ngay
 */
export async function deleteChatMessage(
  messageId: string,
): Promise<DeleteChatMessageResult> {
  try {
    const viewer = await getChatViewer();

    if (!viewer) return { isDeleted: false, error: CHAT_FORBIDDEN_MESSAGE };

    if (typeof messageId !== "string" || !isValidObjectId(messageId)) {
      return { isDeleted: false, error: CHAT_DELETE_ERROR_MESSAGE };
    }

    await connectToDatabase();

    // Không phải mod thì chỉ khớp tin do chính mình gửi
    const deleteFilter: FilterQuery<ChatMessageModelProps> = viewer.isModerator
      ? { _id: messageId }
      : { _id: messageId, "sender.user": viewer.userId };
    const { deletedCount } = await ChatMessageModel.deleteOne(deleteFilter);

    if (deletedCount === 0) {
      return { isDeleted: false, error: CHAT_FORBIDDEN_MESSAGE };
    }

    const payload: ChatMessageDeletedPayload = { messageId };

    await pusherServer
      ?.trigger(CHAT_CHANNEL_NAME, CHAT_EVENTS.MESSAGE_DELETED, payload)
      .catch((error: unknown) => console.log("Pusher trigger error:", error));

    return { isDeleted: true };
  } catch (error) {
    console.log("deleteChatMessage error:", error);

    return { isDeleted: false, error: CHAT_DELETE_ERROR_MESSAGE };
  }
}
