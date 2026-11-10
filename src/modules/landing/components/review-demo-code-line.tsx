import { cn } from "@/shared/utils";
import { ReviewDemoLineTone } from "../types";
import { getCodeTokenClassName, tokenizeCodeLine } from "../utils";
import {
  getReviewDemoLineClassName,
  getReviewDemoLineSign,
  sliceCodeTokens,
} from "../utils/review-demo";

interface ReviewDemoCodeLineProps {
  lineNumber: number;
  code: string;
  /** Số ký tự đang hiện (AI gõ tới đâu hiện tới đó) */
  visibleLength: number;
  lineTone: ReviewDemoLineTone;
  hasCaret: boolean;
}

/** Một dòng code trong editor màn diễn, tô màu cú pháp, có con trỏ gõ */
export function ReviewDemoCodeLine({
  lineNumber,
  code,
  visibleLength,
  lineTone,
  hasCaret,
}: ReviewDemoCodeLineProps) {
  const visibleTokens = sliceCodeTokens(tokenizeCodeLine(code), visibleLength);

  return (
    <div className={getReviewDemoLineClassName(lineTone)}>
      <span className="w-4 shrink-0 select-none text-gray-500">
        {getReviewDemoLineSign(lineTone)}
      </span>
      <span className="w-6 shrink-0 select-none pr-3 text-right text-gray-500">
        {lineNumber}
      </span>
      <code className="min-w-0 whitespace-pre-wrap text-gray-200 [overflow-wrap:anywhere]">
        {visibleTokens.map((codeToken, index) => (
          <span
            key={`${codeToken.text}-${index}`}
            className={cn(
              lineTone !== "removed" && getCodeTokenClassName(codeToken.kind),
            )}
          >
            {codeToken.text}
          </span>
        ))}
        {hasCaret && (
          <span className="ml-px inline-block h-[1.1em] w-0.5 translate-y-[0.2em] animate-caret-blink bg-violet-300" />
        )}
      </code>
    </div>
  );
}
