import { lessonCatalog } from "../constants/lessons";
import { milestoneCatalog } from "../constants/milestones";
import type { Lesson, StepContainer } from "../types/lesson";
import type { Milestone } from "../types/milestone";

export function findLessonBySlug(lessonSlug: string) {
  return lessonCatalog.find((lesson) => lesson.slug === lessonSlug);
}

export function findMilestoneBySlug(milestoneSlug: string) {
  return milestoneCatalog.find((milestone) => milestone.slug === milestoneSlug);
}

// Server action nhận slug từ trình duyệt: chỉ chấp nhận slug có thật trong danh mục bài hoặc mốc.
export function findStepContainerBySlug(slug: string): StepContainer | undefined {
  return findLessonBySlug(slug) ?? findMilestoneBySlug(slug);
}

export function findStepById(container: StepContainer, stepId: string) {
  return container.steps.find((step) => step.id === stepId);
}

export function findNextLesson(lesson: Lesson) {
  return lessonCatalog.find((candidate) => candidate.number === lesson.number + 1);
}

// Bài lab của một mốc là các bài mà bước lab-link của mốc trỏ tới.
export function findMilestoneLessonSlugs(milestone: Milestone) {
  return milestone.steps.flatMap((step) => (step.kind === "lab-link" ? [step.lesson.slug] : []));
}

export function findMilestoneByLessonSlug(lessonSlug: string) {
  return milestoneCatalog.find((milestone) => findMilestoneLessonSlugs(milestone).includes(lessonSlug));
}
