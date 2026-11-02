"use server";

import { saveExplanationNote, saveStepProgress } from "../services/progress-store";
import type { StepProgressPatch } from "../types/progress";
import { findStepById, findStepContainerBySlug } from "../utils/lesson-lookup";

export async function saveStepProgressAction(containerSlug: string, stepId: string, patch: StepProgressPatch) {
  const container = findStepContainerBySlug(containerSlug);
  const step = container && findStepById(container, stepId);

  // slug được dùng làm tên file trong journal/, nên chỉ nhận slug có thật trong danh mục bài hoặc mốc.
  if (!container || !step) {
    throw new Error("Không tìm thấy bước học.");
  }

  if (step.kind === "explain-back" && patch.text) {
    await saveExplanationNote(container.slug, container.title, step.prompt, patch.text);
  }

  return saveStepProgress(container.slug, step.id, patch);
}
