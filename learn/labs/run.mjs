// Chạy và chấm một bài lab: node learn/labs/run.mjs <taskId>
// Chép template của bài vào .runs/<taskId>, ghi file bro đã sửa ở exercises/<taskId>/ vào đúng chỗ,
// build nếu cần, chạy harness rồi in từng check xanh/đỏ.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const labsDir = path.dirname(fileURLToPath(import.meta.url));
const RESULT_PREFIX = "__RESULT__";
const typescriptBuildArgs = ["../../node_modules/typescript/bin/tsc", "-p", "tsconfig.json"];

const taskConfigs = {
  "blocking-observe": { workspace: "node-basics", template: "tasks/blocking-server", targetFile: "solution.cjs", runArgs: ["harness.cjs"] },
  "blocking-fix": { workspace: "node-basics", template: "tasks/blocking-server", targetFile: "solution.cjs", runArgs: ["harness.cjs"] },
  "threadpool-observe": { workspace: "node-basics", template: "tasks/threadpool", targetFile: "solution.cjs", runArgs: ["harness.cjs"] },
  "mini-express-next": { workspace: "node-basics", template: "tasks/mini-express", targetFile: "mini-express.cjs", runArgs: ["harness.cjs"] },
  "mini-express-hang": { workspace: "node-basics", template: "tasks/mini-express", targetFile: "request-id.cjs", runArgs: ["harness.cjs"] },
  "nest-observe": { workspace: "nest-lifecycle", template: "template", targetFile: "src/orders.controller.ts", buildArgs: typescriptBuildArgs, runArgs: ["dist/main.js"] },
  "nest-guard": { workspace: "nest-lifecycle", template: "template", targetFile: "src/auth.guard.ts", buildArgs: typescriptBuildArgs, runArgs: ["dist/main.js"] },
  "nest-di": { workspace: "nest-lifecycle", template: "di-template", targetFile: "src/courses.service.ts", buildArgs: typescriptBuildArgs, runArgs: ["dist/main.js"] },
};

function runNode(args, cwd, taskId) {
  return spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    timeout: 60_000,
    env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: "production", LAB_TASK: taskId },
  });
}

function printReport(rawOutput) {
  const lines = rawOutput.split("\n");
  const reportLine = lines.find((line) => line.startsWith(RESULT_PREFIX));
  const consoleOutput = lines.filter((line) => !line.startsWith(RESULT_PREFIX)).join("\n").trim();

  if (consoleOutput) console.log(`${consoleOutput}\n`);
  if (!reportLine) {
    console.log("✗ Harness không in kết quả: chương trình dừng giữa chừng, đọc lỗi ở trên.");
    return false;
  }

  const { checks } = JSON.parse(reportLine.slice(RESULT_PREFIX.length));
  for (const check of checks) {
    console.log(`${check.isPassed ? "✓" : "✗"} ${check.label}${check.detail ? ` · ${check.detail}` : ""}`);
  }

  const isPassed = checks.every((check) => check.isPassed);
  console.log(`\n${isPassed ? "ĐẠT" : "CHƯA ĐẠT"} · ${checks.filter((check) => check.isPassed).length}/${checks.length} xanh`);

  return isPassed;
}

const taskId = process.argv[2];
const config = taskConfigs[taskId];

if (!config) {
  console.log(`Không có bài "${taskId ?? ""}". Các bài: ${Object.keys(taskConfigs).join(", ")}`);
  process.exit(1);
}

const workspaceDir = path.join(labsDir, config.workspace);
const runDir = path.join(workspaceDir, ".runs", taskId);
const exerciseFile = path.join(labsDir, "exercises", taskId, path.basename(config.targetFile));

if (config.buildArgs && !existsSync(path.join(workspaceDir, "node_modules"))) {
  console.log(`Chưa cài thư viện cho ${config.workspace}. Chạy: npm install --prefix learn/labs/${config.workspace}`);
  process.exit(1);
}

rmSync(runDir, { recursive: true, force: true });
mkdirSync(runDir, { recursive: true });
cpSync(path.join(workspaceDir, config.template), runDir, { recursive: true });
writeFileSync(path.join(runDir, config.targetFile), readFileSync(exerciseFile, "utf8"));

if (config.buildArgs) {
  const buildResult = runNode(config.buildArgs, runDir, taskId);

  if (buildResult.status !== 0) {
    console.log(`${buildResult.stdout}${buildResult.stderr}\n✗ Code chưa biên dịch được.`);
    process.exit(1);
  }
}

const runResult = runNode(config.runArgs, runDir, taskId);
const isPassed = printReport(`${runResult.stdout ?? ""}${runResult.stderr ?? ""}`);
process.exit(isPassed ? 0 : 1);
