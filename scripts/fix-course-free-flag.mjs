/**
 * Gỡ cờ `free` cho các khóa học có giá, để trang chi tiết hiện nút mua thay vì
 * nút nhận miễn phí.
 *
 *   node scripts/fix-course-free-flag.mjs                      # dry-run tất cả khóa free có giá
 *   node scripts/fix-course-free-flag.mjs --apply              # ghi thật
 *   node scripts/fix-course-free-flag.mjs slug-a slug-b        # chỉ xử lý slug chỉ định
 *
 * Không đụng tới khóa có price = 0 (free thật) và không xóa gì.
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const DATABASE_NAME = "EvonHub";
const shouldApply = process.argv.includes("--apply");
const slugs = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));

function readMongoUrl() {
  if (process.env.MONGODB_URL) return process.env.MONGODB_URL;

  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const matched = envFile.match(/^MONGODB_URL=(.*)$/m);

  if (!matched) throw new Error("Không tìm thấy MONGODB_URL");

  return matched[1].trim();
}

function formatMoney(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

async function main() {
  await mongoose.connect(readMongoUrl(), { dbName: DATABASE_NAME });

  const courses = mongoose.connection.collection("courses");
  const query = {
    free: true,
    price: { $gt: 0 },
    ...(slugs.length ? { slug: { $in: slugs } } : {}),
  };

  const affected = await courses
    .find(query, { projection: { title: 1, slug: 1, price: 1 } })
    .toArray();

  console.log(`\nChế độ: ${shouldApply ? "APPLY (ghi thật)" : "DRY-RUN"}`);
  console.log(slugs.length ? `Lọc theo slug: ${slugs.join(", ")}` : "Tất cả khóa free nhưng có giá");
  console.log(`\nKhóa sẽ chuyển sang bán (free: true -> false): ${affected.length}`);

  for (const course of affected) {
    console.log(`  ${formatMoney(course.price).padStart(9)} VNĐ  ${course.slug}`);
    console.log(`               ${course.title}`);
  }

  if (slugs.length) {
    const missing = slugs.filter(
      (slug) => !affected.some((course) => course.slug === slug)
    );

    if (missing.length) {
      console.log(`\nKhông khớp (không tồn tại, không free, hoặc giá 0): ${missing.join(", ")}`);
    }
  }

  if (!affected.length) {
    console.log("\nKhông có khóa nào cần xử lý.\n");
    await mongoose.disconnect();
    return;
  }

  if (!shouldApply) {
    console.log("\nDry-run: chưa ghi gì. Chạy lại với --apply để thực hiện.\n");
    await mongoose.disconnect();
    return;
  }

  const result = await courses.updateMany(query, { $set: { free: false } });

  console.log(`\nĐã chuyển ${result.modifiedCount} khóa sang bán.\n`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Script lỗi:", error);
  await mongoose.disconnect();
  process.exit(1);
});
