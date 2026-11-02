import type { ReactNode } from "react";
import type { StepContainer } from "../types/lesson";
import type { BackLink } from "../types/navigation";
import type { LessonProgress } from "../types/progress";
import type { WorkbenchStep } from "../types/workbench";
import AcceptanceBar from "./acceptance-bar";
import LessonHeader from "./lesson-header";
import LessonProgressProvider from "./lesson-progress-provider";
import LessonStepSection from "./lesson-step-section";
import StepChipNav from "./step-chip-nav";
import StepPageColumns from "./step-page-columns";
import WorkbenchPanel from "./workbench-panel";
import WorkbenchProvider from "./workbench-provider";

interface StepPageShellProps {
  container: StepContainer;
  initialProgress: LessonProgress;
  heading: string;
  backLink: BackLink;
  eyebrow: string;
  summary: string;
  footer: ReactNode;
  // Có thì hiện thanh test dính đáy (trang mốc).
  milestoneNumber?: number;
}

function isWorkbenchStep(step: StepContainer["steps"][number]): step is WorkbenchStep {
  return step.kind === "code-task" || step.kind === "acceptance";
}

// Khung chung của trang bài và trang mốc (bố cục B): đề bài bên trái, bàn làm việc bên phải từ 1280px.
export default function StepPageShell({
  container,
  initialProgress,
  heading,
  backLink,
  eyebrow,
  summary,
  footer,
  milestoneNumber,
}: StepPageShellProps) {
  const workbenchSteps = container.steps.filter(isWorkbenchStep);
  const acceptanceStep = workbenchSteps.find((step) => step.kind === "acceptance");
  const stepNumbers = Object.fromEntries(container.steps.map((step, stepIndex) => [step.id, stepIndex + 1]));

  return (
    <LessonProgressProvider lessonSlug={container.slug} initialProgress={initialProgress}>
      <WorkbenchProvider workbenchSteps={workbenchSteps}>
        <LessonHeader heading={heading} container={container} backLink={backLink} />
        <StepPageColumns
          hasWorkbench={workbenchSteps.length > 0}
          workbench={<WorkbenchPanel stepNumbers={stepNumbers} />}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted">{eyebrow}</p>
              <h1 className="text-xl font-semibold">{container.title}</h1>
              <p className="max-w-[75ch] text-sm text-muted">{summary}</p>
            </div>
            <StepChipNav steps={container.steps} />
          </div>
          {container.steps.map((step, stepIndex) => (
            <LessonStepSection key={step.id} step={step} stepNumber={stepIndex + 1} />
          ))}
          {footer}
        </StepPageColumns>
        {acceptanceStep?.kind === "acceptance" && milestoneNumber !== undefined && (
          <AcceptanceBar step={acceptanceStep} milestoneNumber={milestoneNumber} />
        )}
      </WorkbenchProvider>
    </LessonProgressProvider>
  );
}
