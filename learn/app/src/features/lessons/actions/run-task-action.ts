"use server";

import { taskRunConfigs } from "../constants/task-run-configs";
import { saveStepProgress } from "../services/progress-store";
import { runTask } from "../services/task-runner";
import type { TaskRunResult } from "../types/task-run";
import { findStepById, findStepContainerBySlug } from "../utils/lesson-lookup";

export async function runTaskAction(containerSlug: string, stepId: string, code: string): Promise<TaskRunResult> {
  const container = findStepContainerBySlug(containerSlug);
  const step = container && findStepById(container, stepId);

  if (!container || !step || step.kind !== "code-task") {
    throw new Error("Không tìm thấy bài thực hành.");
  }

  // Bài chỉ xem thì chạy đúng code của bài, bỏ qua thứ trình duyệt gửi lên.
  const codeToRun = step.isEditable ? code : step.code.source;
  const result = await runTask(step.taskId, taskRunConfigs[step.taskId], codeToRun);

  await saveStepProgress(container.slug, step.id, {
    isDone: result.isPassed,
    code: step.isEditable ? code : undefined,
  });

  return result;
}
