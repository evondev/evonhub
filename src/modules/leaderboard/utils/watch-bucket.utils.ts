import {
  CREDIT_SLACK_SECONDS,
  FIRST_CREDIT_MAX_SECONDS,
  LESSON_DURATION_TOLERANCE,
  MAX_BUCKETS_PER_REQUEST,
  MAX_PLAYBACK_RATE,
  UNKNOWN_DURATION_MAX_SECONDS,
  WATCH_BUCKET_SECONDS,
} from "../constants";
import { WatchableLesson } from "../types";

/**
 * Bài này có tối đa bao nhiêu ô. Có thời lượng thì theo thời lượng (dư một chút
 * vì admin nhập tay); chưa nhập mà có video Mux thì một trần rộng; video Drive
 * chưa nhập thời lượng thì không tính được, trả 0.
 */
export function getLessonMaxBucketCount(lesson: WatchableLesson): number {
  const durationMinutes = Number(lesson.duration) || 0;

  if (durationMinutes > 0) {
    return Math.ceil(
      (durationMinutes * 60 * LESSON_DURATION_TOLERANCE) / WATCH_BUCKET_SECONDS,
    );
  }

  if (lesson.video) {
    return Math.ceil(UNKNOWN_DURATION_MAX_SECONDS / WATCH_BUCKET_SECONDS);
  }

  return 0;
}

/** Chỉ giữ số nguyên trong khoảng của bài, bỏ trùng, cắt ở MAX_BUCKETS_PER_REQUEST */
export function sanitizeBuckets(
  buckets: unknown[],
  maxBucketCount: number,
): number[] {
  const validBuckets = buckets.filter(
    (bucket): bucket is number =>
      Number.isInteger(bucket) &&
      (bucket as number) >= 0 &&
      (bucket as number) < maxBucketCount,
  );

  return Array.from(new Set(validBuckets)).slice(0, MAX_BUCKETS_PER_REQUEST);
}

/**
 * Số giây tối đa được cộng lần này, theo thời gian thật đã trôi từ lần cộng
 * trước của cùng người. Mở nhiều tab hay gọi thẳng action cũng không cộng nhanh
 * hơn MAX_PLAYBACK_RATE lần thời gian thật.
 */
export function getCreditableSeconds(
  lastCreditAt: Date | undefined,
  now: Date,
): number {
  if (!lastCreditAt) return FIRST_CREDIT_MAX_SECONDS;

  const elapsedSeconds = Math.max(
    0,
    (now.getTime() - new Date(lastCreditAt).getTime()) / 1000,
  );

  return elapsedSeconds * MAX_PLAYBACK_RATE + CREDIT_SLACK_SECONDS;
}
