import { notFound } from "next/navigation";
import { connection } from "next/server";
import { attachEditorUrls } from "../services/editor-links";
import { readLessonProgress } from "../services/progress-store";
import { findMilestoneBySlug } from "../utils/lesson-lookup";
import MilestoneFooterNote from "./milestone-footer-note";
import StepPageShell from "./step-page-shell";

interface MilestoneBodyProps {
  milestoneSlugPromise: Promise<string>;
}

export default async function MilestoneBody({ milestoneSlugPromise }: MilestoneBodyProps) {
  const milestone = findMilestoneBySlug(await milestoneSlugPromise);

  if (!milestone) notFound();

  // Tiến độ đọc từ file mỗi lần mở trang, không được prerender lúc build.
  await connection();
  const milestoneProgress = await readLessonProgress(milestone.slug);
  const milestoneWithEditorUrls = { ...milestone, steps: attachEditorUrls(milestone.steps) };

  return (
    <StepPageShell
      container={milestoneWithEditorUrls}
      initialProgress={milestoneProgress}
      heading={`Mốc ${milestone.number} · ${milestone.title}`}
      backLink={{ href: "/", label: "Lộ trình" }}
      eyebrow={`${milestone.stage} · Evonhub: ${milestone.feature} · ${milestone.minutes} phút`}
      summary={milestone.summary}
      footer={<MilestoneFooterNote />}
      milestoneNumber={milestone.number}
    />
  );
}
