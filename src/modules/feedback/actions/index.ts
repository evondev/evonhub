"use server";

import UserModel from "@/modules/user/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentAdmin, getCurrentUser } from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import {
  FEEDBACK_DAILY_LIMIT,
  FEEDBACK_SEARCH_USER_LIMIT,
  MAX_FEEDBACKS_PER_PAGE,
} from "../constants";
import FeedbackModel from "../models";
import { feedbackFormSchema } from "../schemas";
import {
  CreateFeedbackResult,
  DeleteFeedbackResult,
  FeedbackFormValues,
  FeedbackModelProps,
  FetchFeedbacksParams,
  FetchFeedbacksResult,
  MyFeedbackStatus,
} from "../types";

type FeedbackQuery = FilterQuery<FeedbackModelProps>;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/** User đang đăng nhập gửi góp ý: khoá học, tính năng muốn có */
export async function createFeedback(
  values: FeedbackFormValues,
): Promise<CreateFeedbackResult> {
  try {
    const parsedValues = feedbackFormSchema.safeParse(values);

    if (!parsedValues.success) {
      return {
        isSuccess: false,
        message: parsedValues.error.issues[0]?.message,
      };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return { isSuccess: false, message: "Bạn cần đăng nhập để góp ý" };
    }

    await connectToDatabase();

    const todayFeedbackCount = await FeedbackModel.countDocuments({
      user: currentUser._id,
      createdAt: { $gte: new Date(Date.now() - ONE_DAY_MS) },
    });

    if (todayFeedbackCount >= FEEDBACK_DAILY_LIMIT) {
      return {
        isSuccess: false,
        message: "Hôm nay bạn góp ý nhiều rồi, mai gửi tiếp nhé",
      };
    }

    await FeedbackModel.create({
      user: currentUser._id,
      courseWish: parsedValues.data.courseWish,
      featureWish: parsedValues.data.featureWish,
      aiCourseOpinion: parsedValues.data.aiCourseOpinion,
      wantsEnglish: parsedValues.data.wantsEnglish,
    });

    return { isSuccess: true };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false, message: "Chưa gửi được, thử lại sau nhé" };
  }
}

/** User đang đăng nhập đã từng góp ý chưa. Lỗi thì undefined để không tự bật hộp */
export async function fetchMyFeedbackStatus(): Promise<
  MyFeedbackStatus | undefined
> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    const hasSubmitted = await FeedbackModel.exists({ user: currentUser._id });

    return { hasSubmitted: Boolean(hasSubmitted) };
  } catch (error) {
    console.log("error:", error);
  }
}

/** Từ khoá khớp nội dung góp ý, hoặc tên, username, email người gửi */
async function buildFeedbackSearchQuery(
  search: unknown,
): Promise<FeedbackQuery> {
  const keyword = typeof search === "string" ? search.trim() : "";

  if (!keyword) return {};

  const keywordRegex = { $regex: escapeRegExp(keyword), $options: "i" };
  const matchedUsers = await UserModel.find({
    $or: [
      { name: keywordRegex },
      { username: keywordRegex },
      { email: keywordRegex },
    ],
  })
    .select("_id")
    .limit(FEEDBACK_SEARCH_USER_LIMIT)
    .lean<{ _id: Types.ObjectId }[]>();

  return {
    $or: [
      { courseWish: keywordRegex },
      { featureWish: keywordRegex },
      { aiCourseOpinion: keywordRegex },
      { user: { $in: matchedUsers.map((user) => user._id) } },
    ],
  };
}

/** Danh sách góp ý cho trang admin, mới nhất trước. Không phải admin thì undefined */
export async function fetchFeedbacks({
  search,
  page = 1,
  limit = 10,
}: FetchFeedbacksParams): Promise<FetchFeedbacksResult | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    await connectToDatabase();

    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_FEEDBACKS_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const query = await buildFeedbackSearchQuery(search);

    const [feedbacks, total] = await Promise.all([
      FeedbackModel.find(query)
        .select(
          "user courseWish featureWish aiCourseOpinion wantsEnglish createdAt",
        )
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit)
        .populate({
          model: UserModel,
          path: "user",
          select: "name username email avatar",
        }),
      FeedbackModel.countDocuments(query),
    ]);

    return { feedbacks: parseData(feedbacks), total };
  } catch (error) {
    console.log("error:", error);
  }
}

/** Admin xoá một góp ý (spam, trùng) */
export async function deleteFeedback(
  feedbackId: string,
): Promise<DeleteFeedbackResult> {
  try {
    // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo
    if (typeof feedbackId !== "string" || !isValidObjectId(feedbackId)) {
      return { isSuccess: false };
    }

    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return { isSuccess: false };

    await connectToDatabase();

    const deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackId);

    return { isSuccess: Boolean(deletedFeedback) };
  } catch (error) {
    console.log("error:", error);

    return { isSuccess: false };
  }
}
