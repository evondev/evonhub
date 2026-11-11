"use server";

import UserModel from "@/modules/user/models";
import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { getCurrentAdmin, getCurrentUser } from "@/shared/libs/auth";
import { isValidObjectId } from "mongoose";
import {
  SUPPORT_ADMIN_SELF_MESSAGE,
  SUPPORT_FORBIDDEN_MESSAGE,
  SUPPORT_INBOX_LIMIT,
  SUPPORT_LIMIT_REACHED_MESSAGE,
  SUPPORT_NOT_FOUND_MESSAGE,
  SUPPORT_RATE_LIMIT_MESSAGE,
  SUPPORT_SEND_ERROR_MESSAGE,
  SUPPORT_SEND_INTERVAL_MS,
  SUPPORT_SIGN_IN_REQUIRED_MESSAGE,
  SUPPORT_THREAD_MESSAGE_LIMIT,
  SUPPORT_UNANSWERED_LIMIT,
} from "../constants";
import { SupportConversationModel, SupportMessageModel } from "../models";
import {
  findActiveAdminIds,
  pingSupportRecipients,
  SUPPORT_USER_FIELDS,
  toSupportConversationItem,
  toSupportMessageItem,
} from "../services/support.service";
import {
  MySupportThread,
  ReplySupportMessageParams,
  ReplySupportMessageResult,
  SendSupportMessageResult,
  SupportConversationModelProps,
  SupportConversationThread,
  SupportInbox,
  SupportInboxFilter,
  SupportMessageModelProps,
  SupportPopulatedConversation,
} from "../types";
import {
  getSupportContentError,
  isSupportLimitReached,
  toSupportPreview,
} from "../utils";

const supportUserPopulate = {
  path: "user",
  model: UserModel,
  select: SUPPORT_USER_FIELDS,
};

/** Người đang đăng nhập nếu được nhắn tin: có tài khoản, không bị khoá */
async function getActiveSupportUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.status === UserStatus.Inactive) return null;

  return currentUser;
}

/** Tin gần nhất của một hội thoại, xếp cũ đến mới */
async function findLatestSupportMessages(conversationId: unknown) {
  const latestMessages = await SupportMessageModel.find({
    conversation: conversationId,
  })
    .sort({ createdAt: -1 })
    .limit(SUPPORT_THREAD_MESSAGE_LIMIT)
    .lean<SupportMessageModelProps[]>();

  return latestMessages.reverse().map(toSupportMessageItem);
}

/** Hội thoại của học viên đang đăng nhập; chưa nhắn lần nào thì rỗng */
export async function fetchMySupportThread(): Promise<
  MySupportThread | undefined
> {
  try {
    const currentUser = await getActiveSupportUser();

    if (!currentUser) return undefined;

    const conversation = await SupportConversationModel.findOne({
      user: currentUser._id,
    })
      .select({ unansweredCount: 1 })
      .lean<Pick<SupportConversationModelProps, "_id" | "unansweredCount">>();

    if (!conversation) return { messages: [], isLimitReached: false };

    return {
      messages: await findLatestSupportMessages(conversation._id),
      isLimitReached: isSupportLimitReached(conversation.unansweredCount),
    };
  } catch (error) {
    console.log("fetchMySupportThread error:", error);
  }
}

/**
 * Học viên nhắn cho Admin. Admin không bắt buộc trả lời nên mỗi người chỉ gửi
 * được SUPPORT_UNANSWERED_LIMIT tin liền nhau khi chưa được đáp
 */
export async function sendMySupportMessage(
  content: string,
): Promise<SendSupportMessageResult> {
  try {
    const currentUser = await getActiveSupportUser();

    if (!currentUser) return { error: SUPPORT_SIGN_IN_REQUIRED_MESSAGE };

    if (currentUser.role === UserRole.Admin) {
      return { error: SUPPORT_ADMIN_SELF_MESSAGE };
    }

    if (typeof content !== "string")
      return { error: SUPPORT_SEND_ERROR_MESSAGE };

    const contentError = getSupportContentError(content);

    if (contentError) return { error: contentError };

    const now = new Date();
    const recentMessage = await SupportMessageModel.exists({
      sender: currentUser._id,
      createdAt: { $gt: new Date(now.getTime() - SUPPORT_SEND_INTERVAL_MS) },
    });

    if (recentMessage) return { error: SUPPORT_RATE_LIMIT_MESSAGE };

    // Lần đầu nhắn thì tạo hội thoại; unique trên user nên hai tab gửi cùng
    // lúc vẫn chỉ ra một hội thoại
    const conversation = await SupportConversationModel.findOneAndUpdate(
      { user: currentUser._id },
      { $setOnInsert: { user: currentUser._id, createdAt: now } },
      { upsert: true, new: true, projection: { _id: 1 } },
    ).lean<Pick<SupportConversationModelProps, "_id">>();

    if (!conversation) return { error: SUPPORT_SEND_ERROR_MESSAGE };

    const trimmedContent = content.trim();
    // Giữ chỗ một lượt trong giới hạn bằng một lần ghi có điều kiện: hai tab
    // gửi cùng lúc cũng không vượt giới hạn
    const updatedConversation = await SupportConversationModel.findOneAndUpdate(
      {
        _id: conversation._id,
        unansweredCount: { $lt: SUPPORT_UNANSWERED_LIMIT },
      },
      {
        $inc: { unansweredCount: 1 },
        $set: {
          lastMessageAt: now,
          lastMessagePreview: toSupportPreview(trimmedContent),
          lastSenderIsAdmin: false,
          isUnreadByAdmin: true,
        },
      },
      { new: true, projection: { unansweredCount: 1 } },
    ).lean<Pick<SupportConversationModelProps, "unansweredCount">>();

    if (!updatedConversation) {
      return { error: SUPPORT_LIMIT_REACHED_MESSAGE, isLimitReached: true };
    }

    const createdMessage = await SupportMessageModel.create({
      conversation: conversation._id,
      sender: currentUser._id,
      isFromAdmin: false,
      content: trimmedContent,
      createdAt: now,
    });
    const adminIds = await findActiveAdminIds();

    await pingSupportRecipients(adminIds, conversation._id.toString());

    return {
      message: toSupportMessageItem(createdMessage.toObject()),
      isLimitReached: isSupportLimitReached(
        updatedConversation.unansweredCount,
      ),
    };
  } catch (error) {
    console.log("sendMySupportMessage error:", error);

    return { error: SUPPORT_SEND_ERROR_MESSAGE };
  }
}

/** Hộp thư của Admin: mới nhất lên đầu, kèm số hội thoại chưa đọc */
export async function fetchSupportInbox(
  filter: SupportInboxFilter,
): Promise<SupportInbox | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return undefined;

    const query = filter === "unread" ? { isUnreadByAdmin: true } : {};
    const [conversations, unreadCount] = await Promise.all([
      SupportConversationModel.find(query)
        .sort({ lastMessageAt: -1 })
        .limit(SUPPORT_INBOX_LIMIT)
        .populate(supportUserPopulate)
        .lean<SupportPopulatedConversation[]>(),
      SupportConversationModel.countDocuments({ isUnreadByAdmin: true }),
    ]);

    return {
      conversations: conversations.map(toSupportConversationItem),
      unreadCount,
    };
  } catch (error) {
    console.log("fetchSupportInbox error:", error);
  }
}

/**
 * Admin mở một hội thoại: tải tin và đánh dấu đã đọc luôn. Đang mở mà có tin
 * mới thì lần tải lại cũng tính là đã đọc
 */
export async function fetchSupportConversation(
  conversationId: string,
): Promise<SupportConversationThread | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin || !isValidObjectId(conversationId)) return undefined;

    const conversation = await SupportConversationModel.findByIdAndUpdate(
      conversationId,
      { $set: { isUnreadByAdmin: false } },
      { new: true },
    )
      .populate(supportUserPopulate)
      .lean<SupportPopulatedConversation>();

    if (!conversation) return undefined;

    return {
      conversation: toSupportConversationItem(conversation),
      messages: await findLatestSupportMessages(conversation._id),
    };
  } catch (error) {
    console.log("fetchSupportConversation error:", error);
  }
}

/** Admin trả lời: mở lại lượt nhắn cho học viên và báo họ có tin mới */
export async function replySupportMessage({
  conversationId,
  content,
}: ReplySupportMessageParams): Promise<ReplySupportMessageResult> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { error: SUPPORT_FORBIDDEN_MESSAGE };

    if (!isValidObjectId(conversationId) || typeof content !== "string") {
      return { error: SUPPORT_NOT_FOUND_MESSAGE };
    }

    const contentError = getSupportContentError(content);

    if (contentError) return { error: contentError };

    const now = new Date();
    const trimmedContent = content.trim();
    const conversation = await SupportConversationModel.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          lastMessageAt: now,
          lastMessagePreview: toSupportPreview(trimmedContent),
          lastSenderIsAdmin: true,
          isUnreadByAdmin: false,
          unansweredCount: 0,
        },
      },
      { new: true, projection: { user: 1 } },
    ).lean<Pick<SupportConversationModelProps, "_id" | "user">>();

    if (!conversation) return { error: SUPPORT_NOT_FOUND_MESSAGE };

    const createdMessage = await SupportMessageModel.create({
      conversation: conversation._id,
      sender: currentAdmin._id,
      isFromAdmin: true,
      content: trimmedContent,
      createdAt: now,
    });

    await pingSupportRecipients(
      [conversation.user.toString()],
      conversation._id.toString(),
    );

    return { message: toSupportMessageItem(createdMessage.toObject()) };
  } catch (error) {
    console.log("replySupportMessage error:", error);

    return { error: SUPPORT_SEND_ERROR_MESSAGE };
  }
}
