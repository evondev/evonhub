import type { LessonStep, StepContainer } from "../types/lesson";
import type { LessonProgress } from "../types/progress";

// Bước đọc và bước trỏ sang bài lab không có thao tác nên không tính vào tiến độ.
export function isTrackedStep(step: LessonStep) {
  return step.kind !== "prose" && step.kind !== "lab-link";
}

export function countLessonProgress(container: StepContainer, lessonProgress: LessonProgress | undefined) {
  const trackedSteps = container.steps.filter(isTrackedStep);
  const doneCount = trackedSteps.filter((step) => lessonProgress?.steps[step.id]?.isDone).length;

  return { doneCount, totalCount: trackedSteps.length };
}
