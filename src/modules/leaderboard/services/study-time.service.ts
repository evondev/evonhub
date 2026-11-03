import "server-only";

import { connectToDatabase } from "@/shared/libs";
import { WATCH_BUCKET_SECONDS } from "../constants";
import { LessonWatchModel, StudyDayModel, StudyTotalModel } from "../models";
import { CreditWatchBucketsParams } from "../types";
import { getCreditableSeconds, getStudyDayKey } from "../utils";

interface LessonWatchBuckets {
  buckets?: number[];
}

interface StudyClock {
  lastCreditAt?: Date;
}

/**
 * Cộng các ô vừa xem của một bài vào phút học. Ô đã tính rồi thì bỏ; số ô mới
 * bị cắt theo thời gian thật từ lần cộng trước (getCreditableSeconds). Chỉ gọi
 * từ server sau khi đã kiểm tra user và quyền vào bài: hàm nhận userId thẳng.
 */
export async function creditWatchBuckets({
  userId,
  lessonId,
  courseId,
  buckets,
}: CreditWatchBucketsParams): Promise<number> {
  await connectToDatabase();

  const lessonWatch = await LessonWatchModel.findOne({
    user: userId,
    lesson: lessonId,
  })
    .select("buckets")
    .lean<LessonWatchBuckets>();
  const watchedBuckets = new Set(lessonWatch?.buckets || []);
  const newBuckets = buckets.filter((bucket) => !watchedBuckets.has(bucket));

  if (newBuckets.length === 0) return 0;

  // Đọc mốc cũ và đặt mốc mới trong một lệnh: hai tab gửi cùng lúc không cùng
  // được tính trên một khoảng thời gian
  const now = new Date();
  const previousClock = await StudyTotalModel.findOneAndUpdate(
    { user: userId },
    { $set: { lastCreditAt: now } },
    { upsert: true, new: false },
  )
    .select("lastCreditAt")
    .lean<StudyClock>();
  const creditableBucketCount = Math.floor(
    getCreditableSeconds(previousClock?.lastCreditAt, now) /
      WATCH_BUCKET_SECONDS,
  );
  const creditedBuckets = newBuckets.slice(0, creditableBucketCount);

  if (creditedBuckets.length === 0) return 0;

  const creditedSeconds = creditedBuckets.length * WATCH_BUCKET_SECONDS;

  await Promise.all([
    LessonWatchModel.updateOne(
      { user: userId, lesson: lessonId },
      {
        $addToSet: { buckets: { $each: creditedBuckets } },
        $set: { updatedAt: now },
        $setOnInsert: { course: courseId },
      },
      { upsert: true },
    ),
    StudyDayModel.updateOne(
      { user: userId, day: getStudyDayKey(now) },
      { $inc: { seconds: creditedSeconds } },
      { upsert: true },
    ),
    StudyTotalModel.updateOne(
      { user: userId },
      { $inc: { seconds: creditedSeconds } },
    ),
  ]);

  return creditedSeconds;
}
