/**
 * Cho hết hạn toàn bộ đơn PENDING quá 24 giờ.
 *
 *   node scripts/expire-stale-orders.mjs           # dry-run, chỉ in báo cáo
 *   node scripts/expire-stale-orders.mjs --apply   # thực sự ghi vào DB
 *
 * Không đụng tới đơn APPROVED / REJECTED / EXPIRED và không xóa cứng bản ghi.
 */
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const PENDING_ORDER_TTL_MS = 24 * 60 * 60 * 1000;
const DATABASE_NAME = "EvonHub";
const shouldApply = process.argv.includes("--apply");

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

  const orders = mongoose.connection.collection("orders");
  const expiryDate = new Date(Date.now() - PENDING_ORDER_TTL_MS);
  const query = {
    status: "PENDING",
    createdAt: { $lte: expiryDate },
  };

  const staleOrders = await orders
    .find(query, { projection: { user: 1, course: 1, total: 1, createdAt: 1 } })
    .toArray();

  const uniqueUsers = new Set(staleOrders.map((order) => String(order.user)));
  const uniquePairs = new Set(
    staleOrders.map((order) => `${order.user}_${order.course}`)
  );
  const totalAmount = staleOrders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );
  const oldestOrder = staleOrders.reduce(
    (oldest, order) =>
      !oldest || order.createdAt < oldest.createdAt ? order : oldest,
    null
  );

  console.log(`\nChế độ:            ${shouldApply ? "APPLY (ghi thật)" : "DRY-RUN"}`);
  console.log(`Mốc hết hạn:       ${expiryDate.toISOString()}`);
  console.log(`Đơn bị ảnh hưởng:  ${staleOrders.length}`);
  console.log(`Cặp user x khóa:   ${uniquePairs.size}`);
  console.log(`Người được gỡ:     ${uniqueUsers.size}`);
  console.log(`Tổng tiền treo:    ${formatMoney(totalAmount)} VNĐ`);

  if (oldestOrder) {
    console.log(`Đơn cũ nhất:       ${oldestOrder.createdAt.toISOString()}`);
  }

  if (!staleOrders.length) {
    console.log("\nKhông có đơn nào cần xử lý.\n");
    await mongoose.disconnect();
    return;
  }

  if (!shouldApply) {
    console.log("\nDry-run: chưa ghi gì. Chạy lại với --apply để thực hiện.\n");
    await mongoose.disconnect();
    return;
  }

  const result = await orders.updateMany(query, {
    $set: { status: "EXPIRED" },
  });

  console.log(`\nĐã chuyển ${result.modifiedCount} đơn sang EXPIRED.\n`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("Migration lỗi:", error);
  await mongoose.disconnect();
  process.exit(1);
});
