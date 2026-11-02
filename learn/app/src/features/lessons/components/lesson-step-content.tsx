import type { LessonStep } from "../types/lesson";
import AcceptanceBlock from "./acceptance-block";
import CodeTaskBlock from "./code-task-block";
import ExplainBackBlock from "./explain-back-block";
import LabLinkBlock from "./lab-link-block";
import MarkdownText from "./markdown-text";
import PredictBlock from "./predict-block";
import SpotBugBlock from "./spot-bug-block";
import StepFlowBlock from "./step-flow-block";

interface LessonStepContentProps {
  step: LessonStep;
}

export default function LessonStepContent({ step }: LessonStepContentProps) {
  switch (step.kind) {
    case "prose":
      return <MarkdownText content={step.body} className="max-w-[75ch]" />;
    case "predict":
      return <PredictBlock step={step} />;
    case "step-flow":
      return <StepFlowBlock step={step} />;
    case "spot-bug":
      return <SpotBugBlock step={step} />;
    case "code-task":
      return <CodeTaskBlock step={step} />;
    case "explain-back":
      return <ExplainBackBlock step={step} />;
    case "acceptance":
      return <AcceptanceBlock step={step} />;
    case "lab-link":
      return <LabLinkBlock step={step} />;
  }
}
