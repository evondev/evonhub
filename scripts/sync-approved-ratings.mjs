/**
 * Tính lại `rating` của khóa học và video từ các đánh giá đã duyệt (status ACTIVE).
 * Trước đây mảng này nhận cả đánh giá chưa duyệt và có sẵn [5] mặc định, nên trang
 * danh sách hiện sao và số lượt khác trang chi tiết.
 *
 *   node scripts/sync-approved-ratings.mjs             # dry-run: chỉ in khác biệt
 *   node scripts/sync-approved-ratings.mjs --apply     # ghi thật
 *
 * Chỉ ghi đè trường `rating`, không xóa đánh giá nào.
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const DATABASE_NAME = "EvonHub";
const ACTIVE_STATUS = "ACTIVE";
const shouldApply = process.argv.includes("--apply");

function readMongoUrl() {
  if (process.env.MONGODB_URL) return process.env.MONGODB_URL;

  const envFile = readFileSync(
    new URL("../.env.local", import.meta.url),
    "utf8",
  );
  const matched = envFile.match(/^MONGODB_URL=(.*)$/m);

  if (!matched) throw new Error("Không tìm thấy MONGODB_URL");

  return matched[1].trim();
}

function formatAverage(ratings) {
  if (ratings.length === 0) return "—";

  const average =
    ratings.reduce((total, rating) => total + rating, 0) / ratings.length;

  return `${average.toFixed(1)} (${ratings.length})`;
}

function isSameRatings(first = [], second = []) {
  return (
    first.length === second.length &&
    first.every((rating, index) => rating === second[index])
  );
}

/** Gom sao của đánh giá đã duyệt theo khóa hoặc video, giữ thứ tự tạo */
async function collectApprovedRatings(targetField) {
  const approvedRatings = await mongoose.connection
    .collection("ratings")
    .find({
      status: ACTIVE_STATUS,
      [targetField]: { $exists: true, $ne: null },
    })
    .sort({ createdAt: 1 })
    .project({ [targetField]: 1, rating: 1 })
    .toArray();
  const ratingsByTarget = new Map();

  for (const approvedRating of approvedRatings) {
    const targetId = String(approvedRating[targetField]);
    const targetRatings = ratingsByTarget.get(targetId) || [];

    targetRatings.push(approvedRating.rating);
    ratingsByTarget.set(targetId, targetRatings);
  }

  return ratingsByTarget;
}

async function syncCollection({ collectionName, targetField, label }) {
  const ratingsByTarget = await collectApprovedRatings(targetField);
  const documents = await mongoose.connection
    .collection(collectionName)
    .find({}, { projection: { title: 1, slug: 1, rating: 1 } })
    .toArray();
  const changes = documents
    .map((document) => ({
      document,
      nextRatings: ratingsByTarget.get(String(document._id)) || [],
    }))
    .filter(
      ({ document, nextRatings }) =>
        !isSameRatings(document.rating, nextRatings),
    );

  console.log(`\n${label}: ${changes.length}/${documents.length} cần sửa`);

  for (const { document, nextRatings } of changes) {
    console.log(
      `  ${formatAverage(document.rating || []).padStart(9)} → ${formatAverage(nextRatings).padEnd(9)}  ${document.slug || document.title}`,
    );
  }

  if (!shouldApply || changes.length === 0) return;

  await mongoose.connection.collection(collectionName).bulkWrite(
    changes.map(({ document, nextRatings }) => ({
      updateOne: {
        filter: { _id: document._id },
        update: { $set: { rating: nextRatings } },
      },
    })),
  );
  console.log(`  Đã ghi ${changes.length} ${label.toLowerCase()}.`);
}

async function main() {
  await mongoose.connect(readMongoUrl(), { dbName: DATABASE_NAME });

  console.log(`Chế độ: ${shouldApply ? "APPLY (ghi thật)" : "DRY-RUN"}`);
  await syncCollection({
    collectionName: "courses",
    targetField: "course",
    label: "Khóa học",
  });
  await syncCollection({
    collectionName: "micros",
    targetField: "video",
    label: "Video",
  });

  if (!shouldApply) console.log("\nChưa ghi gì. Thêm --apply để ghi.");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
