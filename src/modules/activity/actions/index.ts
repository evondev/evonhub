"use server";

import CourseModel from "@/modules/course/models";
import { isCourseFree } from "@/modules/course/utils";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { ActivityType } from "@/shared/constants/activity.constants";
import { CourseStatus, CourseType } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import {
  canAccessCourseContent,
  getCurrentAdmin,
  getCurrentUser,
} from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import {
  ACTIVITY_ONLINE_WINDOW_MS,
  ACTIVITY_SEARCH_USER_LIMIT,
  MAX_ACTIVITIES_PER_PAGE,
} from "../constants";
import ActivityModel from "../models";
import { recordActivity } from "../services/activity.service";
import {
  ActivityModelProps,
  FetchActivitiesParams,
  FetchActivitiesResult,
  ActivityTypeCountGroup,
  LogLessonViewParams,
  LogVideoViewParams,
  OnlineActivityGroup,
} from "../types";
import {
  buildActivityDateRangeQuery,
  buildActivityTabCounts,
  getActivityTypesByGroup,
  getSessionActivityTypes,
  isActivityGroupTab,
} from "../utils";

type ActivityQuery = FilterQuery<ActivityModelProps>;

/**
 * Nhịp từ trang học: ghi (hoặc nối phiên) "đang học bài này" cho user đang
 * đăng nhập. Chỉ ghi bài người đó mở được thật: bài học thử, hoặc khoá đã mua
 * hay quản lý.
 */
export async function logLessonView({
  lessonId,
  courseId,
}: LogLessonViewParams): Promise<void> {
  try {
    // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo như { $ne: null }
    if (typeof lessonId !== "string" || !isValidObjectId(lessonId)) return;

    if (typeof courseId !== "string" || !isValidObjectId(courseId)) return;

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    const lesson = await LessonModel.findOne({
      _id: lessonId,
      courseId,
      _destroy: false,
    })
      .select("trial")
      .lean<{ trial?: boolean }>();

    if (!lesson) return;

    const canViewLesson =
      lesson.trial === true || (await canAccessCourseContent(courseId));

    if (!canViewLesson) return;

    await recordActivity({
      userId: currentUser._id,
      type: ActivityType.ViewLesson,
      courseId,
      lessonId,
      shouldMergeRecent: true,
    });
  } catch (error) {
    console.log("error:", error);
  }
}

/**
 * Nhịp từ trang video lẻ: ghi (hoặc nối phiên) "đang xem video này". Chỉ ghi
 * video người đó xem được thật: video miễn phí đang bán, hoặc đã mua hay quản lý.
 */
export async function logVideoView({
  videoId,
}: LogVideoViewParams): Promise<void> {
  try {
    // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo như { $ne: null }
    if (typeof videoId !== "string" || !isValidObjectId(videoId)) return;

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    await connectToDatabase();

    const video = await CourseModel.findOne({
      _id: videoId,
      type: CourseType.Video,
      _destroy: false,
    })
      .select("price free status isComingSoon")
      .lean<{
        price?: number;
        free?: boolean;
        status?: CourseStatus;
        isComingSoon?: boolean;
      }>();

    if (!video) return;

    const isPublicFreeVideo =
      isCourseFree(video) &&
      video.status === CourseStatus.Approved &&
      !video.isComingSoon;
    const canWatchVideo =
      isPublicFreeVideo || (await canAccessCourseContent(videoId));

    if (!canWatchVideo) return;

    await recordActivity({
      userId: currentUser._id,
      type: ActivityType.ViewVideo,
      courseId: videoId,
      shouldMergeRecent: true,
    });
  } catch (error) {
    console.log("error:", error);
  }
}

/**
 * Từ khoá tìm người (tên, username, email), khoá và khoảng ngày đang lọc, chung
 * cho mọi tab
 */
async function buildActivityScopeQuery({
  search,
  courseId,
  from,
  to,
}: Pick<
  FetchActivitiesParams,
  "search" | "courseId" | "from" | "to"
>): Promise<ActivityQuery> {
  // Chỉ lấy loại việc bản build này biết: DB dùng chung với bản mới hơn có thể
  // có loại lạ, ACTIVITY_TYPE_CONFIGS[type] sẽ undefined và làm sập trang
  const query: ActivityQuery = { type: { $in: Object.values(ActivityType) } };
  const keyword = typeof search === "string" ? search.trim() : "";

  if (keyword) {
    const keywordRegex = { $regex: escapeRegExp(keyword), $options: "i" };
    const matchedUsers = await UserModel.find({
      $or: [
        { name: keywordRegex },
        { username: keywordRegex },
        { email: keywordRegex },
      ],
    })
      .select("_id")
      .limit(ACTIVITY_SEARCH_USER_LIMIT)
      .lean<{ _id: Types.ObjectId }[]>();

    query.user = { $in: matchedUsers.map((user) => user._id) };
  }

  if (typeof courseId === "string" && courseId !== "") {
    // id lạ thì không khớp dòng nào, thay vì bỏ lọc
    query.course = isValidObjectId(courseId)
      ? new Types.ObjectId(courseId)
      : { $in: [] };
  }

  // Lọc theo nhịp gần nhất, cùng mốc với cột giờ và thứ tự của danh sách
  const dateRangeQuery = buildActivityDateRangeQuery(from, to);

  if (dateRangeQuery) query.lastSeenAt = dateRangeQuery;

  return query;
}

/**
 * Dòng "đang học" mới nhất của mỗi người có nhịp trong ACTIVITY_ONLINE_WINDOW_MS,
 * mới nhất trước. Một người chuyển bài liền tay vẫn chỉ hiện ở bài đang mở.
 */
async function findOnlineActivityIds(
  scopeQuery: ActivityQuery,
): Promise<Types.ObjectId[]> {
  const onlineSince = new Date(Date.now() - ACTIVITY_ONLINE_WINDOW_MS);
  const onlineGroups = await ActivityModel.aggregate<OnlineActivityGroup>([
    {
      // $and thay vì trải scopeQuery: scopeQuery có thể đã có lastSeenAt của bộ
      // lọc ngày, ghi đè thì mất điều kiện đó
      $match: {
        $and: [
          scopeQuery,
          {
            type: { $in: getSessionActivityTypes() },
            lastSeenAt: { $gte: onlineSince },
          },
        ],
      },
    },
    { $sort: { lastSeenAt: -1 } },
    {
      $group: {
        _id: "$user",
        activityId: { $first: "$_id" },
        lastSeenAt: { $first: "$lastSeenAt" },
      },
    },
    { $sort: { lastSeenAt: -1 } },
  ]);

  return onlineGroups.map((group) => group.activityId);
}

/** Nhật ký hoạt động cho trang admin. Không phải admin thì undefined */
export async function fetchActivities({
  search,
  tab,
  courseId,
  from,
  to,
  page = 1,
  limit = 10,
}: FetchActivitiesParams): Promise<FetchActivitiesResult | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    await connectToDatabase();

    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_ACTIVITIES_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    const scopeQuery = await buildActivityScopeQuery({
      search,
      courseId,
      from,
      to,
    });
    // Một $group đếm theo loại việc cho mọi tab nhóm, thay vì mỗi tab một count
    const [typeCountGroups, onlineActivityIds] = await Promise.all([
      ActivityModel.aggregate<ActivityTypeCountGroup>([
        { $match: scopeQuery },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),
      findOnlineActivityIds(scopeQuery),
    ]);
    const tabCounts = buildActivityTabCounts(
      typeCountGroups,
      onlineActivityIds.length,
    );

    // Tab "Đang học" đã có sẵn danh sách id theo thứ tự: cắt trang trên mảng đó
    const isOnlineTab = tab === "online";
    const pageQuery: ActivityQuery = { ...scopeQuery };
    let total = tabCounts.all;

    if (isOnlineTab) {
      pageQuery._id = {
        $in: onlineActivityIds.slice(skip, skip + safeLimit),
      };
      total = tabCounts.online;
    }

    if (isActivityGroupTab(tab)) {
      pageQuery.type = { $in: getActivityTypesByGroup(tab) };
      total = tabCounts[tab];
    }

    const activities = await ActivityModel.find(pageQuery)
      .select("type user course lesson targetTitle detail lastSeenAt createdAt")
      .sort({ lastSeenAt: -1 })
      .skip(isOnlineTab ? 0 : skip)
      .limit(safeLimit)
      .populate({
        model: UserModel,
        path: "user",
        select: "name username email avatar role",
      })
      .populate({ model: CourseModel, path: "course", select: "title slug" })
      .populate({ model: LessonModel, path: "lesson", select: "title" });

    return {
      activities: parseData(activities),
      total,
      tabCounts,
    };
  } catch (error) {
    console.log("error:", error);
  }
}
