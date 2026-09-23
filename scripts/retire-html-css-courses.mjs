/**
 * Gỡ hẳn 3 khóa HTML CSS khỏi hệ thống sau khi đã xóa toàn bộ video trên Mux.
 *
 *   node scripts/retire-html-css-courses.mjs            # dry-run, chỉ in ra sẽ đổi gì
 *   node scripts/retire-html-css-courses.mjs --apply    # ghi thật
 *
 * Việc script làm:
 *   1. Đổi `status` của 3 khóa sang `pending`. Khóa `rejected` vẫn nằm trong
 *      LEARNABLE_COURSE_STATUSES nên người đã mua vẫn thấy ở Khu vực học tập;
 *      `pending` thì không. Đây cũng đúng cách `deleteCourse()` đang làm.
 *   2. Xóa `video` và `assetId` ở các bài học còn trỏ tới asset Mux đã bị xóa.
 *
 * Không xóa course, lecture, lesson, order, history hay rating nào. Trạng thái cũ
 * được ghi ra file backup trong thư mục scripts/ để hoàn tác khi cần.
 */
import { readFileSync, writeFileSync } from "node:fs";
import mongoose from "mongoose";

const DATABASE_NAME = "EvonHub";
const RETIRED_STATUS = "pending";
const shouldApply = process.argv.includes("--apply");

const targetSlugs = [
  "khoa-hoc-html-css-co-ban",
  "khoa-hoc-cat-psd-sang-html-css-toan-tap",
  "khoa-hoc-html-css-master",
];

function readMongoUrl() {
  if (process.env.MONGODB_URL) return process.env.MONGODB_URL;

  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const matched = envFile.match(/^MONGODB_URL=(.*)$/m);

  if (!matched) throw new Error("Không tìm thấy MONGODB_URL");

  return matched[1].trim();
}

function writeBackup(snapshot) {
  const backupPath = new URL("./retire-html-css-courses.backup.json", import.meta.url);

  writeFileSync(backupPath, JSON.stringify(snapshot, null, 2), "utf8");

  return backupPath.pathname;
}

async function main() {
  await mongoose.connect(readMongoUrl(), { dbName: DATABASE_NAME });

  const courseCollection = mongoose.connection.collection("courses");
  const lessonCollection = mongoose.connection.collection("lessons");

  const courses = await courseCollection.find({ slug: { $in: targetSlugs } }).toArray();
  const missingSlugs = targetSlugs.filter(
    (slug) => !courses.some((course) => course.slug === slug),
  );

  if (missingSlugs.length) {
    console.log(`Không tìm thấy slug: ${missingSlugs.join(", ")}`);
  }

  const courseIds = courses.map((course) => course._id);
  const staleVideoLessons = await lessonCollection
    .find({ courseId: { $in: courseIds }, video: { $nin: [null, ""] } })
    .toArray();

  console.log(shouldApply ? "=== GHI THẬT ===" : "=== DRY RUN ===");
  console.log("\nĐổi status khóa học:");

  for (const course of courses) {
    console.log(`  ${course.slug}`);
    console.log(`    ${course.title}`);
    console.log(`    status: ${course.status} -> ${RETIRED_STATUS}`);
  }

  console.log(`\nGỡ video id khỏi ${staleVideoLessons.length} bài học:`);

  for (const lesson of staleVideoLessons) {
    console.log(`  [${lesson.slug}] ${lesson.title}`);
    console.log(`    video: ${lesson.video} -> ""`);
  }

  const snapshot = {
    createdAt: new Date().toISOString(),
    courses: courses.map((course) => ({
      _id: course._id.toString(),
      slug: course.slug,
      title: course.title,
      previousStatus: course.status,
    })),
    lessons: staleVideoLessons.map((lesson) => ({
      _id: lesson._id.toString(),
      slug: lesson.slug,
      title: lesson.title,
      previousVideo: lesson.video,
      previousAssetId: lesson.assetId ?? null,
    })),
  };

  if (!shouldApply) {
    console.log("\nChưa ghi gì. Chạy lại với --apply để thực hiện.");
    await mongoose.disconnect();

    return;
  }

  console.log(`\nĐã lưu trạng thái cũ vào ${writeBackup(snapshot)}`);

  const courseResult = await courseCollection.updateMany(
    { _id: { $in: courseIds } },
    { $set: { status: RETIRED_STATUS } },
  );

  const lessonResult = await lessonCollection.updateMany(
    { _id: { $in: staleVideoLessons.map((lesson) => lesson._id) } },
    { $set: { video: "", assetId: "" } },
  );

  console.log(`Đã cập nhật ${courseResult.modifiedCount} khóa học.`);
  console.log(`Đã gỡ video id khỏi ${lessonResult.modifiedCount} bài học.`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
