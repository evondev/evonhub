import { connectToDatabase } from "@/shared/libs";
import { ACTIVITY_SESSION_GAP_MS } from "../constants";
import ActivityModel from "../models";
import { RecordActivityParams } from "../types";
import { truncateActivityDetail } from "../utils/activity-detail.utils";

/** Các trường một dòng nhật ký mang theo, ngoài người, việc và giờ */
function buildActivityFields({
  courseId,
  lessonId,
  targetTitle,
  detail,
}: RecordActivityParams) {
  return {
    course: courseId,
    lesson: lessonId,
    targetTitle,
    detail: detail ? truncateActivityDetail(detail) : undefined,
  };
}

/** Nối vào dòng gần nhất của cùng người, cùng việc, cùng chỗ; không có thì thêm */
async function mergeRecentActivity(params: RecordActivityParams) {
  const now = new Date();
  const sessionStartAfter = new Date(now.getTime() - ACTIVITY_SESSION_GAP_MS);

  await ActivityModel.findOneAndUpdate(
    {
      user: params.userId,
      type: params.type,
      ...(params.courseId ? { course: params.courseId } : {}),
      ...(params.lessonId ? { lesson: params.lessonId } : {}),
      lastSeenAt: { $gte: sessionStartAfter },
    },
    {
      $set: { lastSeenAt: now },
      $setOnInsert: { ...buildActivityFields(params), createdAt: now },
    },
    { upsert: true, sort: { lastSeenAt: -1 } },
  );
}

/**
 * Ghi một việc vào nhật ký. Chỉ gọi từ server sau khi đã xác thực: hàm nhận
 * userId thẳng nên không để trong file "use server". Lỗi ghi nhật ký không được
 * làm hỏng việc chính, nên nuốt lỗi ở đây.
 */
export async function recordActivity(params: RecordActivityParams) {
  try {
    await connectToDatabase();

    if (params.shouldMergeRecent) {
      await mergeRecentActivity(params);

      return;
    }

    await ActivityModel.create({
      user: params.userId,
      type: params.type,
      ...buildActivityFields(params),
    });
  } catch (error) {
    console.log("[activity] Ghi nhật ký lỗi:", error);
  }
}

/** Ghi nhiều việc một lần (duyệt hàng loạt đơn) */
export async function recordActivities(paramsList: RecordActivityParams[]) {
  if (paramsList.length === 0) return;

  try {
    await connectToDatabase();
    await ActivityModel.insertMany(
      paramsList.map((params) => ({
        user: params.userId,
        type: params.type,
        ...buildActivityFields(params),
      })),
      { ordered: false },
    );
  } catch (error) {
    console.log("[activity] Ghi nhật ký lỗi:", error);
  }
}
