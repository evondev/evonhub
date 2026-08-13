/**
 * Tạo user test khớp với clerkId của Clerk instance development, để đăng nhập
 * ở local dùng được các luồng cần tài khoản (mua khóa, đơn hàng...).
 *
 * Lấy clerkId: Clerk Dashboard -> chọn instance Development -> Users -> mở user
 * đang đăng nhập ở local -> copy User ID (dạng user_xxx).
 *
 *   node scripts/create-local-test-user.mjs --clerk-id=user_xxx --email=test@local.dev
 *   node scripts/create-local-test-user.mjs --clerk-id=user_xxx --email=test@local.dev --apply
 *   thêm --admin nếu muốn quyền ADMIN
 *
 * Chỉ thêm đúng một bản ghi user, không đụng dữ liệu sẵn có.
 * Xóa sau khi test: node scripts/create-local-test-user.mjs --clerk-id=user_xxx --remove --apply
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const DATABASE_NAME = "EvonHub";
const args = process.argv.slice(2);
const shouldApply = args.includes("--apply");
const shouldRemove = args.includes("--remove");
const isAdmin = args.includes("--admin");

function readArg(name) {
  const found = args.find((arg) => arg.startsWith(`--${name}=`));

  return found ? found.split("=").slice(1).join("=").trim() : "";
}

function readMongoUrl() {
  if (process.env.MONGODB_URL) return process.env.MONGODB_URL;

  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const matched = envFile.match(/^MONGODB_URL=(.*)$/m);

  if (!matched) throw new Error("Không tìm thấy MONGODB_URL");

  return matched[1].trim();
}

async function main() {
  const clerkId = readArg("clerk-id");

  if (!clerkId) {
    console.error("Thiếu --clerk-id=user_xxx");
    process.exit(1);
  }

  await mongoose.connect(readMongoUrl(), { dbName: DATABASE_NAME });

  const users = mongoose.connection.collection("users");
  const existing = await users.findOne({ clerkId });

  console.log(`\nChế độ: ${shouldApply ? "APPLY (ghi thật)" : "DRY-RUN"}`);
  console.log(`clerkId: ${clerkId}`);
  console.log(`Đã tồn tại trong DB: ${existing ? `có (${existing.email})` : "chưa"}`);

  if (shouldRemove) {
    if (!existing) {
      console.log("\nKhông có gì để xóa.\n");
    } else if (shouldApply) {
      await users.deleteOne({ clerkId });
      console.log(`\nĐã xóa user test ${existing.email}.\n`);
    } else {
      console.log(`\nSẽ xóa user ${existing.email}. Chạy lại với --apply.\n`);
    }

    await mongoose.disconnect();
    return;
  }

  if (existing) {
    console.log("\nUser đã có sẵn, không cần tạo thêm.\n");
    await mongoose.disconnect();
    return;
  }

  const email = readArg("email") || `local-test-${Date.now()}@evonhub.local`;
  const username = readArg("username") || `local-test-${Date.now()}`;
  const newUser = {
    clerkId,
    email,
    username,
    name: "Local Test",
    avatar: "https://evonhub.dev/logo-main.png",
    role: isAdmin ? "ADMIN" : "USER",
    status: "ACTIVE",
    courses: [],
    createdAt: new Date(),
  };

  console.log("\nSẽ tạo user:");
  console.log(`  email: ${newUser.email}`);
  console.log(`  username: ${newUser.username}`);
  console.log(`  role: ${newUser.role}`);

  if (!shouldApply) {
    console.log("\nDry-run: chưa ghi gì. Chạy lại với --apply để tạo.\n");
    await mongoose.disconnect();
    return;
  }

  await users.insertOne(newUser);
  console.log("\nĐã tạo user test. Reload lại trang local là mua được.\n");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Script lỗi:", error);
  await mongoose.disconnect();
  process.exit(1);
});
