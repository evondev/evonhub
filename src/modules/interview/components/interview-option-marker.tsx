import { Check, X } from "lucide-react";
import { InterviewOptionVisualState } from "../utils/interview-option-style.utils";

interface InterviewOptionMarkerProps {
  visualState: InterviewOptionVisualState;
  letter: string;
}

/** Ô tròn đầu đáp án: chữ cái, nộp rồi thì dấu đúng hoặc dấu sai */
export function InterviewOptionMarker({
  visualState,
  letter,
}: InterviewOptionMarkerProps) {
  if (visualState === "correct") return <Check className="size-4" />;
  if (visualState === "wrong") return <X className="size-4" />;

  return <>{letter}</>;
}
