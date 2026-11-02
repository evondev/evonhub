import "server-only";
import type { TaskRunConfig } from "../types/task-run";

const typescriptBuildArgs = ["../../node_modules/typescript/bin/tsc", "-p", "tsconfig.json"];

// Cách chạy từng bài thực hành. Chỉ server đọc file này: trình duyệt gửi lên taskId,
// không bao giờ gửi lệnh.
export const taskRunConfigs: Record<string, TaskRunConfig> = {
  "blocking-observe": {
    workspace: "node-basics",
    template: "tasks/blocking-server",
    targetFile: "solution.cjs",
    runArgs: ["harness.cjs"],
    timeoutMs: 15_000,
  },
  "blocking-fix": {
    workspace: "node-basics",
    template: "tasks/blocking-server",
    targetFile: "solution.cjs",
    runArgs: ["harness.cjs"],
    timeoutMs: 15_000,
  },
  "threadpool-observe": {
    workspace: "node-basics",
    template: "tasks/threadpool",
    targetFile: "solution.cjs",
    runArgs: ["harness.cjs"],
    timeoutMs: 15_000,
  },
  "mini-express-next": {
    workspace: "node-basics",
    template: "tasks/mini-express",
    targetFile: "mini-express.cjs",
    runArgs: ["harness.cjs"],
    timeoutMs: 15_000,
  },
  "mini-express-hang": {
    workspace: "node-basics",
    template: "tasks/mini-express",
    targetFile: "request-id.cjs",
    runArgs: ["harness.cjs"],
    timeoutMs: 15_000,
  },
  "nest-observe": {
    workspace: "nest-lifecycle",
    template: "template",
    targetFile: "src/orders.controller.ts",
    buildArgs: typescriptBuildArgs,
    runArgs: ["dist/main.js"],
    timeoutMs: 30_000,
  },
  "nest-guard": {
    workspace: "nest-lifecycle",
    template: "template",
    targetFile: "src/auth.guard.ts",
    buildArgs: typescriptBuildArgs,
    runArgs: ["dist/main.js"],
    timeoutMs: 30_000,
  },
  "nest-di": {
    workspace: "nest-lifecycle",
    template: "di-template",
    targetFile: "src/courses.service.ts",
    buildArgs: typescriptBuildArgs,
    runArgs: ["dist/main.js"],
    timeoutMs: 30_000,
  },
};
