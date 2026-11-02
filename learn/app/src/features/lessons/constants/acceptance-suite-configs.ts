import "server-only";
import type { AcceptanceSuiteConfig } from "../types/task-run";

// Test chấp nhận của từng mốc, chạy trong api/ của repo. Chạy tay trong terminal: `cd api && npm test`.
export const acceptanceSuiteConfigs: Record<string, AcceptanceSuiteConfig> = {
  "milestone-01": {
    workspace: "evonhub-api",
    outDir: "dist",
    buildArgs: ["node_modules/typescript/bin/tsc", "-p", "tsconfig.json"],
    runArgs: ["--test", "--test-reporter=./lab/reporter.mjs", "dist/test/milestone-01.e2e.js"],
    // Middleware quên next() thì 9 test, mỗi test chờ 2 giây: hơn 20 giây.
    timeoutMs: 60_000,
  },
};
