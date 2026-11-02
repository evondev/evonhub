"use server";

import { acceptanceSuiteConfigs } from "../constants/acceptance-suite-configs";
import { saveStepProgress } from "../services/progress-store";
import { runAcceptanceSuite } from "../services/task-runner";
import type { TaskRunResult } from "../types/task-run";
import { findStepById, findStepContainerBySlug } from "../utils/lesson-lookup";

export async function runAcceptanceAction(containerSlug: string, stepId: string): Promise<TaskRunResult> {
  const container = findStepContainerBySlug(containerSlug);
  const step = container && findStepById(container, stepId);

  if (!container || !step || step.kind !== "acceptance") {
    throw new Error("Không tìm thấy bộ test chấp nhận.");
  }

  const result = await runAcceptanceSuite(step.suiteId, acceptanceSuiteConfigs[step.suiteId]);
  await saveStepProgress(container.slug, step.id, {
    isDone: result.isPassed,
    passedCount: result.checks.filter((check) => check.isPassed).length,
    checkCount: result.checks.length,
  });

  return result;
}
