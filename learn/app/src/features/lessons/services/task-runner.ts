import "server-only";
import { spawn } from "node:child_process";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AcceptanceSuiteConfig, NodeRunConfig, TaskCheck, TaskRunConfig, TaskRunResult } from "../types/task-run";
import { resolveWorkspaceDir } from "./lab-paths";

const RESULT_PREFIX = "__RESULT__";
const OUTPUT_LIMIT = 20_000;

interface CommandResult {
  output: string;
  exitCode: number | null;
  isTimedOut: boolean;
}

interface HarnessReport {
  checks: TaskCheck[];
}

function runNode(args: string[], cwd: string, timeoutMs: number, taskId: string) {
  return new Promise<CommandResult>((resolve) => {
    // Env tối giản: không để biến nội bộ của Next lọt vào bài lab.
    const child = spawn(process.execPath, args, {
      cwd,
      env: { PATH: process.env.PATH, HOME: process.env.HOME, NODE_ENV: "production", LAB_TASK: taskId },
    });
    let output = "";
    let isTimedOut = false;

    function appendOutput(chunk: Buffer) {
      if (output.length < OUTPUT_LIMIT) output += chunk.toString();
    }

    child.stdout.on("data", appendOutput);
    child.stderr.on("data", appendOutput);

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ output, exitCode, isTimedOut });
    });
  });
}

function splitHarnessOutput(rawOutput: string) {
  const lines = rawOutput.split("\n");
  const reportLine = lines.find((line) => line.startsWith(RESULT_PREFIX));
  const consoleOutput = lines
    .filter((line) => !line.startsWith(RESULT_PREFIX))
    .join("\n")
    .trim();

  if (!reportLine) return { consoleOutput, checks: [] };

  const report = JSON.parse(reportLine.slice(RESULT_PREFIX.length)) as HarnessReport;

  return { consoleOutput, checks: report.checks };
}

function buildFailedResult(label: string, output: string, startedAt: number): TaskRunResult {
  return {
    isPassed: false,
    checks: [{ label, isPassed: false }],
    output: output.trim(),
    durationMs: Date.now() - startedAt,
  };
}

async function buildAndRun(runDir: string, config: NodeRunConfig, runId: string, startedAt: number) {
  if (config.buildArgs) {
    const buildResult = await runNode(config.buildArgs, runDir, config.timeoutMs, runId);

    if (buildResult.exitCode !== 0) {
      return buildFailedResult("Code biên dịch được", buildResult.output, startedAt);
    }
  }

  const runResult = await runNode(config.runArgs, runDir, config.timeoutMs, runId);

  if (runResult.isTimedOut) {
    return buildFailedResult(`Chạy xong trong ${config.timeoutMs / 1000} giây`, runResult.output, startedAt);
  }

  const { consoleOutput, checks } = splitHarnessOutput(runResult.output);

  if (checks.length === 0) {
    return buildFailedResult("Chạy tới cuối mà không lỗi", consoleOutput, startedAt);
  }

  const taskRunResult: TaskRunResult = {
    isPassed: checks.every((check) => check.isPassed),
    checks,
    output: consoleOutput,
    durationMs: Date.now() - startedAt,
  };

  return taskRunResult;
}

export async function runTask(taskId: string, config: TaskRunConfig, code: string): Promise<TaskRunResult> {
  const startedAt = Date.now();
  const workspaceDir = resolveWorkspaceDir(config.workspace);
  const runDir = path.join(workspaceDir, ".runs", taskId);

  await rm(runDir, { recursive: true, force: true });
  await mkdir(runDir, { recursive: true });
  await cp(path.join(workspaceDir, config.template), runDir, { recursive: true });
  await writeFile(path.join(runDir, config.targetFile), code);

  return buildAndRun(runDir, config, taskId, startedAt);
}

// Test chấp nhận build và chạy ngay trong thư mục project. Hai lần chạy chồng nhau thì
// lần sau xoá dist của lần trước giữa chừng, nên xếp hàng từng lần một.
let pendingSuiteRun: Promise<unknown> = Promise.resolve();

export function runAcceptanceSuite(suiteId: string, config: AcceptanceSuiteConfig) {
  const suiteRunPromise = pendingSuiteRun.then(async () => {
    const startedAt = Date.now();
    const projectDir = resolveWorkspaceDir(config.workspace);

    await rm(path.join(projectDir, config.outDir), { recursive: true, force: true });

    return buildAndRun(projectDir, config, suiteId, startedAt);
  });
  pendingSuiteRun = suiteRunPromise.catch(() => undefined);

  return suiteRunPromise;
}
