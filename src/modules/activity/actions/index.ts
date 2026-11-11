"use server";

import CourseModel from "@/modules/course/models";
import { isCourseFree } from "@/modules/course/utils";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { ActivityType } from "@/shared/constants/activity.constants";
import { CourseStatus, CourseType } from "@/shared/constants/course.constants";
import { UserRole } from "@/shared/constants/user.constants";
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
  LESSON_LEARNERS_AVATAR_LIMIT,
  MAX_ACTIVITIES_PER_PAGE,
} from "../constants";
import ActivityModel from "../models";
import { recordActivity } from "../services/activity.service";
import {
  ActivityManageTabCounts,
  ActivityModelProps,
  ActivityTypeCountGroup,
  FetchActivitiesParams,
  FetchActivitiesResult,
  FetchLessonLearnersParams,
  FetchLessonLearnersResult,
  FetchTopLessonsParams,
  FetchTopLessonsResult,
  LogLessonViewParams,
  LessonLearnersFacet,
  LogVideoViewParams,
  OnlineActivityGroup,
  TopLessonFacet,
  TopLessonItemData,
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
 * User đang đăng nhập mở được bài này thật không: bài thuộc đúng khoá, chưa
 * xoá, và là bài học thử hoặc khoá đã mua hay quản lý
 */
async function canViewLesson({
  lessonId,
  courseId,
}: LogLessonViewParams): Promise<boolean> {
  // Chỉ nhận chuỗi id, chặn client gửi object toán tử Mongo như { $ne: null }
  if (typeof lessonId !== "string" || !isValidObjectId(lessonId)) return false;

  if (typeof courseId !== "string" || !isValidObjectId(courseId)) return false;

  await connectToDatabase();

  const lesson = await LessonModel.findOne({
    _id: lessonId,
    courseId,
    _destroy: false,
  })
    .select("trial")
    .lean<{ trial?: boolean }>();

  if (!lesson) return false;

  return lesson.trial === true || (await canAccessCourseContent(courseId));
}

/**
 * Nhịp từ trang học: ghi (hoặc nối phiên) "đang học bài này" cho user đang
 * đăng nhập. Chỉ ghi bài người đó mở được thật.
 */
export async function logLessonView({
  lessonId,
  courseId,
}: LogLessonViewParams): Promise<void> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    if (!(await canViewLesson({ lessonId, courseId }))) return;

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
 * Người khác đang học cùng bài, cho dòng "N người đang học cùng bạn" ở trang
 * học. Cùng định nghĩa "đang học" với tab của admin: dòng mới nhất của mỗi
 * người có nhịp trong ACTIVITY_ONLINE_WINDOW_MS. Chỉ đếm học viên: admin,
 * chuyên gia mở bài để kiểm tra thì không tính. Không xem được bài thì null
 */
export async function fetchLessonLearners({
  lessonId,
  courseId,
}: FetchLessonLearnersParams): Promise<FetchLessonLearnersResult | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return null;

    if (!(await canViewLesson({ lessonId, courseId }))) return null;

    const onlineSince = new Date(Date.now() - ACTIVITY_ONLINE_WINDOW_MS);
    const [learnersFacet] = await ActivityModel.aggregate<LessonLearnersFacet>([
      {
        $match: {
          type: { $in: getSessionActivityTypes() },
          lastSeenAt: { $gte: onlineSince },
          user: { $ne: currentUser._id },
        },
      },
      // Lấy bài mới nhất của mỗi người trước rồi mới lọc theo bài: người vừa
      // chuyển sang bài khác thì không còn tính ở bài này
      { $sort: { lastSeenAt: -1 } },
      {
        $group: {
          _id: "$user",
          lesson: { $first: "$lesson" },
          lastSeenAt: { $first: "$lastSeenAt" },
        },
      },
      { $match: { lesson: new Types.ObjectId(lessonId) } },
      {
        $lookup: {
          from: UserModel.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
                role: UserRole.User,
              },
            },
            { $project: { name: 1, avatar: 1 } },
          ],
          as: "user",
        },
      },
      // Không khớp học viên (staff, người đã xoá) thì $unwind bỏ luôn dòng đó
      { $unwind: "$user" },
      { $sort: { lastSeenAt: -1 } },
      {
        $facet: {
          total: [{ $count: "count" }],
          learners: [
            { $limit: LESSON_LEARNERS_AVATAR_LIMIT },
            { $project: { name: "$user.name", avatar: "$user.avatar" } },
          ],
        },
      },
    ]);

    return {
      total: learnersFacet?.total[0]?.count || 0,
      learners: (learnersFacet?.learners || []).map((learner) => ({
        userId: learner._id.toString(),
        name: learner.name || "",
        avatar: learner.avatar,
      })),
    };
  } catch (error) {
    console.log("error:", error);

    return null;
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

/** Số của các tab nhật ký, kèm id dòng "đang học" (tab "Đang học" cần để cắt trang) */
async function countActivityTabs(scopeQuery: ActivityQuery): Promise<{
  tabCounts: ActivityManageTabCounts;
  onlineActivityIds: Types.ObjectId[];
}> {
  // Một $group đếm theo loại việc cho mọi tab nhóm, thay vì mỗi tab một count
  const [typeCountGroups, onlineActivityIds] = await Promise.all([
    ActivityModel.aggregate<ActivityTypeCountGroup>([
      { $match: scopeQuery },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),
    findOnlineActivityIds(scopeQuery),
  ]);

  return {
    tabCounts: buildActivityTabCounts(
      typeCountGroups,
      onlineActivityIds.length,
    ),
    onlineActivityIds,
  };
}

/** Trang và số dòng mỗi trang client gửi lên, ép về số nguyên trong giới hạn */
function normalizeActivityPaging(page: unknown, limit: unknown) {
  const safeLimit = Math.min(
    Math.max(Math.floor(Number(limit)) || 1, 1),
    MAX_ACTIVITIES_PER_PAGE,
  );
  const safePage = Math.max(Math.floor(Number(page)) || 1, 1);

  return { safeLimit, skip: (safePage - 1) * safeLimit };
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

    const { safeLimit, skip } = normalizeActivityPaging(page, limit);
    const scopeQuery = await buildActivityScopeQuery({
      search,
      courseId,
      from,
      to,
    });
    const { tabCounts, onlineActivityIds } =
      await countActivityTabs(scopeQuery);

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

/**
 * Bảng xếp hạng bài học cho tab "Top bài học": nhiều người học nhất lên đầu,
 * hoà thì xét số phiên rồi tổng thời gian. Dùng chung bộ lọc người, khoá và
 * ngày với nhật ký. Không phải admin thì undefined
 */
export async function fetchTopLessons({
  search,
  courseId,
  from,
  to,
  page = 1,
  limit = 10,
}: FetchTopLessonsParams): Promise<FetchTopLessonsResult | undefined> {
  try {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin) return;

    await connectToDatabase();

    const { safeLimit, skip } = normalizeActivityPaging(page, limit);
    const scopeQuery = await buildActivityScopeQuery({
      search,
      courseId,
      from,
      to,
    });
    const [{ tabCounts }, [topLessonFacet]] = await Promise.all([
      countActivityTabs(scopeQuery),
      ActivityModel.aggregate<TopLessonFacet>([
        {
          $match: {
            $and: [
              scopeQuery,
              { type: ActivityType.ViewLesson, lesson: { $ne: null } },
            ],
          },
        },
        // Gom theo (bài, người) trước để đếm người khác nhau mà không phải
        // giữ cả mảng người trong một nhóm
        {
          $group: {
            _id: { lesson: "$lesson", user: "$user" },
            course: { $first: "$course" },
            sessionCount: { $sum: 1 },
            totalStudyMs: {
              $sum: { $subtract: ["$lastSeenAt", "$createdAt"] },
            },
          },
        },
        {
          $group: {
            _id: "$_id.lesson",
            course: { $first: "$course" },
            learnerCount: { $sum: 1 },
            sessionCount: { $sum: "$sessionCount" },
            totalStudyMs: { $sum: "$totalStudyMs" },
          },
        },
        {
          $facet: {
            lessons: [
              {
                $sort: {
                  learnerCount: -1,
                  sessionCount: -1,
                  totalStudyMs: -1,
                  _id: 1,
                },
              },
              { $skip: skip },
              { $limit: safeLimit },
            ],
            total: [{ $count: "count" }],
          },
        },
      ]),
    ]);
    const lessonGroups = topLessonFacet?.lessons || [];

    const [lessons, courses] = await Promise.all([
      LessonModel.find({
        _id: { $in: lessonGroups.map((group) => group._id) },
      })
        .select("title _destroy")
        .lean<{ _id: Types.ObjectId; title: string; _destroy?: boolean }[]>(),
      CourseModel.find({
        _id: {
          $in: lessonGroups
            .map((group) => group.course)
            .filter((courseId) => courseId !== undefined && courseId !== null),
        },
      })
        .select("title slug")
        .lean<{ _id: Types.ObjectId; title: string; slug: string }[]>(),
    ]);
    const lessonById = new Map(
      lessons.map((lesson) => [lesson._id.toString(), lesson]),
    );
    const courseById = new Map(
      courses.map((course) => [course._id.toString(), course]),
    );

    const topLessons: TopLessonItemData[] = lessonGroups.map((group, index) => {
      const lesson = lessonById.get(group._id.toString());
      const course = group.course
        ? courseById.get(group.course.toString())
        : undefined;

      return {
        lessonId: group._id.toString(),
        rank: skip + index + 1,
        lesson: lesson
          ? { _id: lesson._id.toString(), title: lesson.title }
          : null,
        isLessonDeleted: !lesson || lesson._destroy === true,
        course: course
          ? {
              _id: course._id.toString(),
              title: course.title,
              slug: course.slug,
            }
          : null,
        learnerCount: group.learnerCount,
        sessionCount: group.sessionCount,
        totalStudyMinutes: Math.round(Math.max(group.totalStudyMs, 0) / 60_000),
      };
    });

    return {
      lessons: topLessons,
      total: topLessonFacet?.total[0]?.count || 0,
      tabCounts,
    };
  } catch (error) {
    console.log("error:", error);
  }
}
