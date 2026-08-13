/**
 * Giả lập một giao dịch SePay gửi vào webhook, ký HMAC-SHA256 y như SePay làm.
 * Dùng để test luồng thanh toán ở local mà không cần chuyển khoản thật.
 *
 *   node scripts/send-test-webhook.mjs --code=DH12345678 --amount=999000
 *   node scripts/send-test-webhook.mjs --code=DH12345678 --amount=999000 --url=http://localhost:3001
 *
 * Mặc định gọi http://localhost:3000. Ưu tiên ký HMAC bằng SEPAY_WEBHOOK_SECRET,
 * nếu không có thì rơi về API Key với SEPAY_WEBHOOK_TOKEN.
 */
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

function readArg(name, fallback = "") {
  const found = args.find((arg) => arg.startsWith(`--${name}=`));

  return found ? found.split("=").slice(1).join("=").trim() : fallback;
}

function readEnv(name) {
  if (process.env[name]) return process.env[name];

  const envFile = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const matched = envFile.match(new RegExp(`^${name}=(.*)$`, "m"));

  return matched ? matched[1].trim() : "";
}

const orderCode = readArg("code");
const amount = Number(readArg("amount", "0"));
const baseUrl = readArg("url", "http://localhost:3000");

if (!orderCode || !amount) {
  console.error("Cần --code=DHxxxxxxxx và --amount=999000");
  process.exit(1);
}

const payload = {
  // Id ngẫu nhiên theo thời gian để không bị coi là giao dịch trùng
  id: Number(String(Date.now()).slice(-9)),
  gateway: readEnv("NEXT_PUBLIC_SEPAY_BANK_NAME") || "ACB",
  transactionDate: new Date().toISOString().slice(0, 19).replace("T", " "),
  accountNumber: readEnv("NEXT_PUBLIC_SEPAY_BANK_ACCOUNT") || "33366668888",
  code: null,
  content: `CT DEN ${orderCode}`,
  transferType: "in",
  transferAmount: amount,
  accumulated: 0,
  subAccount: null,
  referenceCode: `TEST.${Date.now()}`,
  description: "",
};

const rawBody = JSON.stringify(payload);
const headers = { "Content-Type": "application/json" };
const webhookSecret = readEnv("SEPAY_WEBHOOK_SECRET");

if (webhookSecret) {
  const timestamp = Math.floor(Date.now() / 1000);

  headers["X-SePay-Timestamp"] = String(timestamp);
  headers["X-SePay-Signature"] = `sha256=${createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex")}`;
  console.log("Xác thực: HMAC-SHA256");
} else {
  headers.Authorization = `Apikey ${readEnv("SEPAY_WEBHOOK_TOKEN")}`;
  console.log("Xác thực: API Key");
}

const response = await fetch(`${baseUrl}/api/webhook/sepay`, {
  method: "POST",
  headers,
  body: rawBody,
});

console.log(`Đơn:    ${orderCode}`);
console.log(`Số tiền: ${amount}`);
console.log(`HTTP:   ${response.status}`);
console.log(`Trả về: ${await response.text()}`);
