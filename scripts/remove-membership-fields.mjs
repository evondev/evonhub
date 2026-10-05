/**
 * Dọn các field của tính năng hội viên đã gỡ khỏi document user.
 *
 *   node scripts/remove-membership-fields.mjs            # dry-run, chỉ in ra sẽ đổi gì
 *   node scripts/remove-membership-fields.mjs --apply    # ghi thật
 *
 * Việc script làm: `$unset` 4 field `plan`, `planStartDate`, `planEndDate`,
 * `isMembership` trên mọi user còn giữ chúng. Code đã không đọc các field này.
 *
 * Không đụng tới đơn hàng: `order.plan` vẫn giữ để đọc lại đơn gói cũ. Giá trị cũ
 * của user có gói được ghi ra file backup trong thư mục scripts/ để hoàn tác.
 */
import { readFileSync, writeFileSync } from "node:fs";
import mongoose from "mongoose";

const DATABASE_NAME = "EvonHub";
const MEMBERSHIP_FIELDS = ["plan", "planStartDate", "planEndDate", "isMembership"];
const shouldApply = process.argv.includes("--apply");

function readMongoUrl() {
  if (process.env.MONGODB_URL) return process.env.MONGODB_URL;

  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const matched = envFile.match(/^MONGODB_URL=(.*)$/m);

  if (!matched) throw new Error("Không tìm thấy MONGODB_URL");

  return matched[1].trim();
}

function writeBackup(snapshot) {
  const backupPath = new URL("./remove-membership-fields.backup.json", import.meta.url);

  writeFileSync(backupPath, JSON.stringify(snapshot, null, 2), "utf8");

  return backupPath.pathname;
}

async function main() {
  await mongoose.connect(readMongoUrl(), { dbName: DATABASE_NAME });

  const userCollection = mongoose.connection.collection("users");
  const hasAnyFieldFilter = {
    $or: MEMBERSHIP_FIELDS.map((field) => ({ [field]: { $exists: true } })),
  };
  const affectedCount = await userCollection.countDocuments(hasAnyFieldFilter);
  // Chỉ user từng có gói thật mới cần lưu lại; còn lại chỉ mang giá trị mặc định
  const planUsers = await userCollection
    .find({ $or: [{ isMembership: true }, { plan: { $nin: [null, "none"] } }] })
    .project({ email: 1, username: 1, plan: 1, planStartDate: 1, planEndDate: 1, isMembership: 1 })
    .toArray();

  console.log(shouldApply ? "=== GHI THẬT ===" : "=== DRY RUN ===");
  console.log(`\nSẽ gỡ ${MEMBERSHIP_FIELDS.join(", ")} khỏi ${affectedCount} user.`);
  console.log(`Trong đó ${planUsers.length} user từng có gói:`);

  for (const user of planUsers) {
    console.log(
      `  ${user.username || user.email} · ${user.plan} · hết hạn ${user.planEndDate ?? "—"}`,
    );
  }

  const snapshot = {
    createdAt: new Date().toISOString(),
    users: planUsers.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      plan: user.plan ?? null,
      planStartDate: user.planStartDate ?? null,
      planEndDate: user.planEndDate ?? null,
      isMembership: user.isMembership ?? null,
    })),
  };

  if (!shouldApply) {
    console.log("\nChưa ghi gì. Chạy lại với --apply để thực hiện.");
    await mongoose.disconnect();

    return;
  }

  console.log(`\nĐã lưu trạng thái cũ vào ${writeBackup(snapshot)}`);

  const unsetFields = Object.fromEntries(MEMBERSHIP_FIELDS.map((field) => [field, ""]));
  const result = await userCollection.updateMany(hasAnyFieldFilter, { $unset: unsetFields });

  console.log(`Đã dọn ${result.modifiedCount} user.`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
