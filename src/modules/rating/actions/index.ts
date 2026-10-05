"use server";

import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { RatingStatus } from "@/shared/constants/rating.constants";
import {
  MODERATION_DELETE_ERROR_MESSAGE,
  MODERATION_SAVE_ERROR_MESSAGE,
} from "@/shared/constants/moderation.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { findManageableCourseIds, getCurrentStaff } from "@/shared/libs/auth";
import { ModerationResult, ModerationScope } from "@/shared/types";
import {
  getSafeKeyword,
  isExcludedIdList,
} from "@/shared/utils/moderation.utils";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId } from "mongoose";
import RatingModel from "../models";
import {
  MAX_RATINGS_PER_PAGE,
  MAX_RATINGS_PER_UPDATE,
  RATING_STATUS_FORBIDDEN_MESSAGE,
  RATING_STATUS_NOT_FOUND_MESSAGE,
} from "../constants/rating-manage.constants";
import { FetchRatingsPublicProps, RatingItemData } from "../types";
import {
  FetchRatingsManageParams,
  FetchRatingsManageResult,
  UpdateMatchingRatingsStatusParams,
  UpdateRatingsStatusParams,
} from "../types/rating-manage.types";

export async function fetchRatingsByCourse({
  courseId,
}: {
  courseId: string;
}): Promise<RatingItemData[] | undefined> {
  try {
    connectToDatabase();

    const ratings = await RatingModel.find({
      course: courseId,
      status: RatingStatus.Active,
    }).populate({
      model: UserModel,
      path: "user",
      select: "name username avatar",
    });

    return parseData(ratings);
  } catch (error) {
    console.log(error);
  }
}

function isRatingStatus(status: unknown): status is RatingStatus {
  return Object.values(RatingStatus).includes(status as RatingStatus);
}

interface RatingScopeStaff {
  _id: unknown;
  role: string;
}

/**
 * Đánh giá người quản lý được đụng tới, đã áp từ khoá và khoá học (chưa lọc
 * trạng thái): admin mọi khoá, expert khoá của mình. Dùng chung cho danh sách,
 * số đếm tab và thao tác "tất cả" để hai bên luôn cùng một phạm vi.
 */
async function buildRatingScopeQuery(
  currentStaff: RatingScopeStaff,
  { search, courseId }: ModerationScope,
): Promise<FilterQuery<typeof RatingModel>> {
  const scopeQuery: FilterQuery<typeof RatingModel> = {};
  const keyword = getSafeKeyword(search);

  if (keyword) {
    scopeQuery.content = { $regex: escapeRegExp(keyword), $options: "i" };
  }

  const courseIds = await findManageableCourseIds(currentStaff, courseId);

  if (courseIds) scopeQuery.course = { $in: courseIds };

  return scopeQuery;
}

/**
 * Admin thấy mọi đánh giá, expert chỉ thấy đánh giá trên khoá mình đứng tên.
 * Từ khoá và khoá học áp cho cả số đếm từng tab; trạng thái chỉ áp cho danh sách.
 */
export async function fetchRatingsManage({
  status,
  courseId,
  page = 1,
  limit = 10,
  search,
}: FetchRatingsManageParams): Promise<FetchRatingsManageResult | undefined> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    await connectToDatabase();

    const baseQuery = await buildRatingScopeQuery(currentStaff, {
      search,
      courseId,
    });
    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_RATINGS_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const query: FilterQuery<typeof RatingModel> = { ...baseQuery };

    // So khớp đúng giá trị: chuỗi lạ từ client thì không lọc
    if (isRatingStatus(status)) query.status = status;

    const [ratings, total, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        RatingModel.find(query)
          .select("content rating status createdAt user course")
          .skip(skip)
          .limit(safeLimit)
          .sort({ createdAt: -1 })
          .populate({ model: UserModel, path: "user", select: "name avatar" })
          .populate({
            model: CourseModel,
            path: "course",
            select: "title slug",
          }),
        RatingModel.countDocuments(query),
        RatingModel.countDocuments({
          ...baseQuery,
          status: RatingStatus.Inactive,
        }),
        RatingModel.countDocuments({
          ...baseQuery,
          status: RatingStatus.Active,
        }),
        RatingModel.countDocuments({
          ...baseQuery,
          status: RatingStatus.Rejected,
        }),
      ]);

    return {
      ratings: parseData(ratings),
      total,
      tabCounts: {
        [RatingStatus.Inactive]: pendingCount,
        [RatingStatus.Active]: approvedCount,
        [RatingStatus.Rejected]: rejectedCount,
        all: pendingCount + approvedCount + rejectedCount,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

function isRatingIdList(ratingIds: unknown): ratingIds is string[] {
  return (
    Array.isArray(ratingIds) &&
    ratingIds.length > 0 &&
    ratingIds.length <= MAX_RATINGS_PER_UPDATE &&
    ratingIds.every(
      (ratingId) => typeof ratingId === "string" && isValidObjectId(ratingId),
    )
  );
}

/**
 * Duyệt hoặc từ chối một hay nhiều đánh giá. Chỉ người quản lý khoá được đổi:
 * có một đánh giá ngoài quyền thì không đổi gì cả. Xong thì tính lại số sao
 * đã duyệt của từng khoá bị đụng tới.
 */
export async function updateRatingsStatus({
  ratingIds,
  status,
}: UpdateRatingsStatusParams): Promise<ModerationResult> {
  try {
    if (!isRatingIdList(ratingIds) || !isRatingStatus(status)) {
      return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
    }

    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: RATING_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const ratings = await RatingModel.find({ _id: { $in: ratingIds } }).select(
      "course",
    );

    if (ratings.length === 0) {
      return { isSuccess: false, message: RATING_STATUS_NOT_FOUND_MESSAGE };
    }

    const manageableCourseIds = await findManageableCourseIds(currentStaff);
    const manageableCourseIdSet = new Set(manageableCourseIds?.map(String));
    const canManageAll = ratings.every(
      (rating) =>
        !manageableCourseIds ||
        manageableCourseIdSet.has(String(rating.course)),
    );

    if (!canManageAll) {
      return { isSuccess: false, message: RATING_STATUS_FORBIDDEN_MESSAGE };
    }

    await RatingModel.updateMany(
      { _id: { $in: ratings.map((rating) => rating._id) } },
      { status },
    );

    const touchedCourseIds = [
      ...new Set(ratings.map((rating) => String(rating.course))),
    ];

    await Promise.all(
      touchedCourseIds.map((touchedCourseId) =>
        syncApprovedRatings({ courseId: touchedCourseId }),
      ),
    );

    return { isSuccess: true, count: ratings.length };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
  }
}

/**
 * Duyệt hoặc từ chối mọi đánh giá khớp bộ lọc đang xem (từ khoá, khoá học,
 * trạng thái của tab), trừ các đánh giá người dùng đã bỏ tick. Xong thì tính lại
 * số sao đã duyệt của từng khoá bị đụng tới.
 */
export async function updateMatchingRatingsStatus({
  scope,
  currentStatus,
  excludedIds,
  status,
}: UpdateMatchingRatingsStatusParams): Promise<ModerationResult> {
  try {
    const isValidCurrentStatus =
      currentStatus === undefined || isRatingStatus(currentStatus);

    if (
      !isRatingStatus(status) ||
      !isValidCurrentStatus ||
      !isExcludedIdList(excludedIds)
    ) {
      return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
    }

    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: RATING_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const query = await buildRatingScopeQuery(currentStaff, scope);

    query._id = { $nin: excludedIds };
    // Đánh giá đã ở đúng trạng thái đích thì để yên
    query.status = currentStatus
      ? { $eq: currentStatus, $ne: status }
      : { $ne: status };

    const touchedCourseIds: unknown[] =
      await RatingModel.find(query).distinct("course");
    const updateResult = await RatingModel.updateMany(query, { status });

    await Promise.all(
      touchedCourseIds.map((touchedCourseId) =>
        syncApprovedRatings({ courseId: String(touchedCourseId) }),
      ),
    );

    return { isSuccess: true, count: updateResult.modifiedCount };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
  }
}

/**
 * Xoá vĩnh viễn mọi đánh giá đã từ chối khớp bộ lọc đang xem. Đánh giá từ chối
 * không được tính sao nên số sao của khoá không đổi. Người viết sẽ đánh giá lại
 * được khoá đó. Không khôi phục được.
 */
export async function deleteRejectedRatings(
  scope: ModerationScope,
): Promise<ModerationResult> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: RATING_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const query = await buildRatingScopeQuery(currentStaff, scope);

    query.status = RatingStatus.Rejected;

    const deleteResult = await RatingModel.deleteMany(query);

    return { isSuccess: true, count: deleteResult.deletedCount };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_DELETE_ERROR_MESSAGE };
  }
}

interface SyncApprovedRatingsProps {
  courseId?: string;
}

/**
 * `rating` trên khóa là bản sao số sao của các đánh giá đã duyệt, để
 * danh sách khóa không phải đếm lại. Tính lại mỗi lần đổi trạng thái duyệt.
 */
async function syncApprovedRatings({ courseId }: SyncApprovedRatingsProps) {
  if (courseId) {
    const approvedRatings = await RatingModel.find({
      course: courseId,
      status: RatingStatus.Active,
    }).select("rating");

    await CourseModel.findByIdAndUpdate(courseId, {
      rating: approvedRatings.map((approvedRating) => approvedRating.rating),
    });
  }
}

export async function fetchRatingsPublic({
  limit,
  page,
  rating,
  courseSlugs,
}: FetchRatingsPublicProps): Promise<RatingItemData[] | undefined> {
  try {
    connectToDatabase();

    const query: FilterQuery<typeof RatingModel> = {};
    const skip = (page - 1) * limit;

    query.status = RatingStatus.Active;
    query.$expr = {
      $gt: [{ $strLenCP: "$content" }, 20],
    };

    if (rating) query.rating = rating;

    if (courseSlugs?.length) {
      const courseIds = await CourseModel.find({
        slug: { $in: courseSlugs },
      }).distinct("_id");

      query.course = { $in: courseIds };
    }

    const ratings = await RatingModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({
        model: UserModel,
        path: "user",
        select: "name username avatar",
      })
      .populate({ model: CourseModel, path: "course", select: "title" });

    return parseData(ratings);
  } catch (error) {
    console.log(error);
  }
}
