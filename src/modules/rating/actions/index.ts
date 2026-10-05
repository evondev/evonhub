"use server";

import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentCourseManager, getCurrentStaff } from "@/shared/libs/auth";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery, isValidObjectId } from "mongoose";
import RatingModel from "../models";
import {
  FetchRatingManageProps,
  HandleRatingStatusProps,
  HandleRatingStatusResult,
  RatingItemData,
} from "../types";

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

export async function fetchRatings({
  limit,
  page,
  status,
}: FetchRatingManageProps): Promise<RatingItemData[] | undefined> {
  try {
    connectToDatabase();

    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    const query: FilterQuery<typeof RatingModel> = {};
    const skip = (page - 1) * limit;
    const ratingStatuses: string[] = Object.values(RatingStatus);

    // So khớp đúng giá trị: regex từ client thì lọc gì cũng được
    if (status && ratingStatuses.includes(status)) query.status = status;

    // Đánh giá không có trường author: expert lọc theo các khóa mình đứng tên
    if (currentStaff.role !== UserRole.Admin) {
      const ownCourseIds = await CourseModel.find({
        author: currentStaff._id,
      }).distinct("_id");

      query.course = { $in: ownCourseIds };
    }
    const ratings = await RatingModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({
        model: UserModel,
        path: "user",
        select: "name username email avatar",
      })
      .populate({
        model: CourseModel,
        path: "course",
        select: "image title slug",
      });

    return parseData(ratings);
  } catch (error) {
    console.log(error);
  }
}

export async function handleRatingStatus({
  ratingId,
  status,
}: HandleRatingStatusProps): Promise<HandleRatingStatusResult> {
  try {
    await connectToDatabase();

    if (!isValidObjectId(ratingId)) {
      return { isSuccess: false, message: "Không tìm thấy đánh giá" };
    }

    const findRating = await RatingModel.findById(ratingId).select("course");

    if (!findRating) {
      return { isSuccess: false, message: "Không tìm thấy đánh giá" };
    }

    // Admin duyệt mọi khóa, expert chỉ duyệt đánh giá trên khóa mình đứng tên
    const courseManager = await getCurrentCourseManager(
      findRating.course?.toString(),
    );

    if (!courseManager) {
      return {
        isSuccess: false,
        message: "Bạn không có quyền duyệt đánh giá của khóa này",
      };
    }

    await RatingModel.findByIdAndUpdate(ratingId, {
      status:
        status === RatingStatus.Active
          ? RatingStatus.Inactive
          : RatingStatus.Active,
    });
    await syncApprovedRatings({
      courseId: findRating.course?.toString(),
    });

    return { isSuccess: true };
  } catch (error) {
    console.log(error);

    return { isSuccess: false };
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
}: FetchRatingManageProps): Promise<RatingItemData[] | undefined> {
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
