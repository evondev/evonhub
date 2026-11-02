import { notFound } from "next/navigation";
import { connection } from "next/server";
import { readLessonProgress } from "../services/progress-store";
import { findLessonBySlug, findMilestoneByLessonSlug, findNextLesson } from "../utils/lesson-lookup";
import LessonFooterNav from "./lesson-footer-nav";
import StepPageShell from "./step-page-shell";

interface LessonBodyProps {
  lessonSlugPromise: Promise<string>;
}

export default async function LessonBody({ lessonSlugPromise }: LessonBodyProps) {
  const lesson = findLessonBySlug(await lessonSlugPromise);

  if (!lesson) notFound();

  // Tiến độ đọc từ file mỗi lần mở trang, không được prerender lúc build.
  await connection();
  const lessonProgress = await readLessonProgress(lesson.slug);
  const milestone = findMilestoneByLessonSlug(lesson.slug);
  const backLink = milestone
    ? { href: `/milestones/${milestone.slug}`, label: `Mốc ${milestone.number}` }
    : { href: "/", label: "Lộ trình" };

  return (
    <StepPageShell
      container={lesson}
      initialProgress={lessonProgress}
      heading={`Bài ${lesson.number} · ${lesson.title}`}
      backLink={backLink}
      eyebrow={`${lesson.stage} · ${lesson.minutes} phút`}
      summary={lesson.summary}
      footer={<LessonFooterNav milestone={milestone} nextLesson={findNextLesson(lesson)} />}
    />
  );
}
