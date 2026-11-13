import { InterviewAnswerFeedback } from "../types";
import { InterviewAnswerResult } from "./interview-answer-result";
import { InterviewSelfCheck } from "./interview-self-check";
import { InterviewSourceList } from "./interview-source-list";

interface InterviewFeedbackPanelProps {
  feedback: InterviewAnswerFeedback;
  explanationText: string;
  coveredKeyPoints: number[];
  onToggleKeyPoint: (keyPointIndex: number) => void;
}

/** Sau khi nộp: kết quả, giải thích, tự đối chiếu ý chính, nguồn */
export function InterviewFeedbackPanel({
  feedback,
  explanationText,
  coveredKeyPoints,
  onToggleKeyPoint,
}: InterviewFeedbackPanelProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-background/60 p-4">
      <InterviewAnswerResult feedback={feedback} />
      <p className="whitespace-pre-line text-pretty text-sm leading-6 text-foreground/90">
        {feedback.explanation}
      </p>
      <InterviewSelfCheck
        attemptId={feedback.attemptId}
        explanationText={explanationText}
        keyPoints={feedback.keyPoints}
        coveredKeyPoints={coveredKeyPoints}
        onToggle={onToggleKeyPoint}
      />
      <InterviewSourceList sources={feedback.sources} version={feedback.version} />
    </section>
  );
}
