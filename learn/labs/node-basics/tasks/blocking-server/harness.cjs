const crypto = require("node:crypto");
const path = require("node:path");
const { report } = require("../../lib/report.cjs");
const { startServer } = require("../../lib/start-server.cjs");

const HEALTH_DELAY_MS = 20;
const HEALTH_LIMIT_MS = 50;
const isObserveRun = process.env.LAB_TASK === "blocking-observe";

async function sendRequest(baseUrl, routePath, startedAt) {
  const sentAfterMs = Date.now() - startedAt;
  const response = await fetch(baseUrl + routePath);
  const body = await response.text();

  return { body, sentAfterMs, finishedAfterMs: Date.now() - startedAt };
}

function waitFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function main() {
  const expectedHash = crypto.pbkdf2Sync("matkhau123", "evon-salt", 1_000_000, 64, "sha512").toString("hex");
  const { child, port } = await startServer(path.join(__dirname, "solution.cjs"));
  const baseUrl = `http://127.0.0.1:${port}`;

  const startedAt = Date.now();
  const hashPromise = sendRequest(baseUrl, "/hash", startedAt);
  await waitFor(HEALTH_DELAY_MS);
  const healthPromise = sendRequest(baseUrl, "/health", startedAt);
  const [hashResult, healthResult] = await Promise.all([hashPromise, healthPromise]);
  child.kill();

  const healthWaitMs = healthResult.finishedAfterMs - healthResult.sentAfterMs;
  console.log(`Gửi /hash   lúc ${hashResult.sentAfterMs}ms → xong lúc ${hashResult.finishedAfterMs}ms`);
  console.log(`Gửi /health lúc ${healthResult.sentAfterMs}ms → xong lúc ${healthResult.finishedAfterMs}ms (chờ ${healthWaitMs}ms)`);

  if (isObserveRun) {
    report([{ label: "Đã chạy xong, xem số đo ở trên", isPassed: true }]);
    return;
  }

  report([
    {
      label: "/hash vẫn trả đúng mã băm",
      isPassed: hashResult.body === expectedHash,
      detail: hashResult.body === expectedHash ? undefined : `Nhận được: ${hashResult.body.slice(0, 40)}…`,
    },
    {
      label: `/health trả lời dưới ${HEALTH_LIMIT_MS}ms trong lúc /hash đang băm`,
      isPassed: healthWaitMs < HEALTH_LIMIT_MS && healthResult.finishedAfterMs < hashResult.finishedAfterMs,
      detail: `/health chờ ${healthWaitMs}ms`,
    },
  ]);
}

main().catch((error) => {
  console.error(error.message);
  report([{ label: "Server chạy được", isPassed: false, detail: error.message }]);
});
