const path = require("node:path");
const { report } = require("../../lib/report.cjs");
const { startServer } = require("../../lib/start-server.cjs");

const RESPONSE_TIMEOUT_MS = 2000;
const isHangTask = process.env.LAB_TASK === "mini-express-hang";

async function sendRequest(baseUrl, routePath, headers = {}) {
  const startedAt = Date.now();

  try {
    const response = await fetch(baseUrl + routePath, { headers, signal: AbortSignal.timeout(RESPONSE_TIMEOUT_MS) });
    const text = await response.text();
    const body = response.headers.get("content-type") === "application/json" ? JSON.parse(text) : text;

    return {
      status: response.status,
      body,
      requestId: response.headers.get("x-request-id"),
      elapsedMs: Date.now() - startedAt,
    };
  } catch (error) {
    const isTimeout = error.name === "TimeoutError";
    const failure = isTimeout
      ? `không có response sau ${RESPONSE_TIMEOUT_MS}ms`
      : `không kết nối được (${error.cause?.code ?? error.message})`;

    return { status: null, failure, elapsedMs: Date.now() - startedAt };
  }
}

function describeResult(result) {
  if (result.status === null) return result.failure;

  return `${result.status} ${JSON.stringify(result.body)}`;
}

// Check đạt thì bỏ detail: output phía trên đã in đủ.
function buildCheck(label, isPassed, detail) {
  return { label, isPassed, detail: isPassed ? undefined : detail };
}

function describeTimedResult(result) {
  if (result.status === null) return result.failure;

  return `${result.status} sau ${result.elapsedMs}ms, header x-request-id: ${result.requestId ?? "(không có)"}`;
}

function hasTrace(result, expectedTrace) {
  return JSON.stringify(result.body?.trace) === JSON.stringify(expectedTrace);
}

async function runNextChecks(baseUrl, readServerExit) {
  const routePaths = ["/courses/nextjs-14-fullstack", "/khong-co", "/courses/khong-co", "/boom", "/courses/html-css-2019", "/health"];
  const results = {};

  for (const routePath of routePaths) {
    results[routePath] = await sendRequest(baseUrl, routePath);
    console.log(`GET ${routePath.padEnd(29)} → ${describeResult(results[routePath])}`);
  }

  const courseResult = results["/courses/nextjs-14-fullstack"];
  const unknownRouteResult = results["/khong-co"];
  const missingCourseResult = results["/courses/khong-co"];
  const syncErrorResult = results["/boom"];
  const asyncErrorResult = results["/courses/html-css-2019"];
  const serverExit = readServerExit();

  return [
    buildCheck(
      "Middleware chạy theo thứ tự app.use, rồi tới handler",
      courseResult.status === 200 && hasTrace(courseResult, ["logger", "handler"]),
      describeResult(courseResult),
    ),
    buildCheck("Route /courses/:slug đọc được slug", courseResult.body?.slug === "nextjs-14-fullstack"),
    buildCheck(
      "Route lạ → middleware notFound trả 404",
      unknownRouteResult.status === 404 && hasTrace(unknownRouteResult, ["logger", "notFound"]),
      describeResult(unknownRouteResult),
    ),
    buildCheck(
      "next(lỗi) bỏ qua notFound, nhảy thẳng tới error handler",
      missingCourseResult.status === 404 && hasTrace(missingCourseResult, ["logger", "handler", "errorHandler"]),
      describeResult(missingCourseResult),
    ),
    buildCheck(
      "throw đồng bộ → error handler trả 500",
      syncErrorResult.status === 500 && hasTrace(syncErrorResult, ["logger", "handler", "errorHandler"]),
      describeResult(syncErrorResult),
    ),
    buildCheck(
      "Lỗi trong handler async → error handler trả 500",
      asyncErrorResult.status === 500 && asyncErrorResult.body?.message === "Internal server error",
      describeResult(asyncErrorResult),
    ),
    buildCheck(
      "Server vẫn sống sau các lỗi",
      results["/health"].status === 200 && !serverExit,
      serverExit ? `process server đã thoát (${serverExit})` : describeResult(results["/health"]),
    ),
  ];
}

async function runHangChecks(baseUrl) {
  const withoutHeader = await sendRequest(baseUrl, "/health");
  console.log(`GET /health, không gửi x-request-id  → ${describeTimedResult(withoutHeader)}`);

  const withHeader = await sendRequest(baseUrl, "/health", { "x-request-id": "lb-7f3a" });
  console.log(`GET /health, x-request-id: lb-7f3a    → ${describeTimedResult(withHeader)}`);

  return [
    buildCheck("Không gửi x-request-id → 200, có id mới", withoutHeader.status === 200 && Boolean(withoutHeader.requestId)),
    buildCheck(
      "Gửi x-request-id (như load balancer) → có response trong 2 giây",
      withHeader.status === 200,
      withHeader.failure,
    ),
    buildCheck(
      "Response giữ nguyên id lb-7f3a",
      withHeader.requestId === "lb-7f3a",
      withHeader.status === null ? undefined : `Nhận ${withHeader.requestId}`,
    ),
  ];
}

async function main() {
  const { child, port } = await startServer(path.join(__dirname, "app.cjs"));
  const baseUrl = `http://127.0.0.1:${port}`;
  let serverExit = "";

  child.once("exit", (code, signal) => {
    serverExit = `exit code ${code ?? signal}`;
  });

  const checks = isHangTask ? await runHangChecks(baseUrl) : await runNextChecks(baseUrl, () => serverExit);
  child.kill();
  report(checks);
}

main().catch((error) => {
  console.error(error.message);
  report([{ label: "Server chạy được", isPassed: false, detail: error.message }]);
});
