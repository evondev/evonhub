import { lessonCatalog } from "../constants/lessons";
import { milestoneCatalog } from "../constants/milestones";
import { upcomingMilestones } from "../constants/upcoming-milestones";
import type { LabProgress } from "../types/progress";
import type { RoadmapItem, RoadmapLessonSummary, RoadmapStageGroup } from "../types/roadmap";
import { findLessonBySlug, findMilestoneByLessonSlug, findMilestoneLessonSlugs } from "./lesson-lookup";
import { countLessonProgress } from "./lesson-progress";

function summarizeLesson(lessonSlug: string, labProgress: LabProgress): RoadmapLessonSummary[] {
  const lesson = findLessonBySlug(lessonSlug);
  if (!lesson) return [];

  const { doneCount, totalCount } = countLessonProgress(lesson, labProgress.lessons[lesson.slug]);

  return [{ slug: lesson.slug, number: lesson.number, title: lesson.title, doneCount, totalCount }];
}

// Mốc đã viết lấy tiến độ từ journal; mốc chưa viết chỉ có tên và vấn đề sẽ vấp.
export function buildRoadmapGroups(labProgress: LabProgress): RoadmapStageGroup[] {
  const writtenItems: RoadmapItem[] = milestoneCatalog.map((milestone) => {
    const milestoneSteps = labProgress.lessons[milestone.slug]?.steps ?? {};
    const acceptanceStep = milestone.steps.find((step) => step.kind === "acceptance");
    const acceptanceProgress = acceptanceStep ? milestoneSteps[acceptanceStep.id] : undefined;
    const { doneCount, totalCount } = countLessonProgress(milestone, labProgress.lessons[milestone.slug]);

    return {
      number: milestone.number,
      title: milestone.title,
      stage: milestone.stage,
      problem: milestone.problem,
      status: doneCount === totalCount ? "xong" : "chua-lam",
      gameLevels: milestone.gameLevels,
      loadTest: milestone.loadTest,
      slug: milestone.slug,
      feature: milestone.feature,
      summary: milestone.summary,
      doneCount,
      totalCount,
      passedCount: acceptanceProgress?.passedCount,
      checkCount: acceptanceProgress?.checkCount,
      todoCount: acceptanceStep?.kind === "acceptance" ? acceptanceStep.todoFiles.length : 0,
      lessons: findMilestoneLessonSlugs(milestone).flatMap((lessonSlug) => summarizeLesson(lessonSlug, labProgress)),
    };
  });

  // Mốc đang làm: mốc đã viết đầu tiên chưa xong.
  const currentItem = writtenItems.find((item) => item.status !== "xong");
  if (currentItem) currentItem.status = "dang-lam";

  const upcomingItems: RoadmapItem[] = upcomingMilestones.map((upcomingMilestone) => ({
    ...upcomingMilestone,
    status: "chua-viet",
    lessons: [],
  }));

  const allItems = [...writtenItems, ...upcomingItems].sort((first, second) => first.number - second.number);
  const stageNames = [...new Set(allItems.map((item) => item.stage))];

  return stageNames.map((stage) => ({ stage, items: allItems.filter((item) => item.stage === stage) }));
}

// Bài không thuộc mốc nào: bài nền tảng học trước khi làm theo mốc.
export function buildFoundationLessons(labProgress: LabProgress) {
  return lessonCatalog
    .filter((lesson) => !findMilestoneByLessonSlug(lesson.slug))
    .flatMap((lesson) => summarizeLesson(lesson.slug, labProgress));
}
