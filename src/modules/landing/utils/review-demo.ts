import {
  REVIEW_DEMO_CODE_LINES,
  REVIEW_DEMO_DONE_MS,
  REVIEW_DEMO_FIXED_LINE,
  REVIEW_DEMO_FIXING_MS,
  REVIEW_DEMO_FLAGGED_MS,
  REVIEW_DEMO_REVIEWING_MS,
  REVIEW_DEMO_TYPING_MS_PER_CHAR,
} from "../constants/review-demo.constants";
import { cn } from "@/shared/utils";
import { CodeToken, ReviewDemoFrame, ReviewDemoLineTone } from "../types";

const TOTAL_CODE_CHAR_COUNT = REVIEW_DEMO_CODE_LINES.join("").length;

const TYPING_END_MS = TOTAL_CODE_CHAR_COUNT * REVIEW_DEMO_TYPING_MS_PER_CHAR;

const REVIEWING_END_MS = TYPING_END_MS + REVIEW_DEMO_REVIEWING_MS;

const FLAGGED_END_MS = REVIEWING_END_MS + REVIEW_DEMO_FLAGGED_MS;

const FIXING_END_MS = FLAGGED_END_MS + REVIEW_DEMO_FIXING_MS;

/** Một vòng màn diễn dài bao nhiêu mili giây, hết vòng thì lặp lại */
export const REVIEW_DEMO_CYCLE_MS = FIXING_END_MS + REVIEW_DEMO_DONE_MS;

/** Khung cuối (đã sửa xong), dùng khi máy bật giảm chuyển động */
export const REVIEW_DEMO_FINAL_FRAME: ReviewDemoFrame = {
  phase: "done",
  typedCharCount: TOTAL_CODE_CHAR_COUNT,
  scanProgress: 1,
  fixedCharCount: REVIEW_DEMO_FIXED_LINE.length,
};

/** Editor trông ra sao ở mili giây thứ elapsedMs của một vòng */
export function getReviewDemoFrame(elapsedMs: number): ReviewDemoFrame {
  if (elapsedMs < TYPING_END_MS) {
    return {
      phase: "typing",
      typedCharCount: Math.floor(elapsedMs / REVIEW_DEMO_TYPING_MS_PER_CHAR),
      scanProgress: 0,
      fixedCharCount: 0,
    };
  }

  if (elapsedMs < REVIEWING_END_MS) {
    return {
      phase: "reviewing",
      typedCharCount: TOTAL_CODE_CHAR_COUNT,
      scanProgress: (elapsedMs - TYPING_END_MS) / REVIEW_DEMO_REVIEWING_MS,
      fixedCharCount: 0,
    };
  }

  if (elapsedMs < FLAGGED_END_MS) {
    return {
      phase: "flagged",
      typedCharCount: TOTAL_CODE_CHAR_COUNT,
      scanProgress: 1,
      fixedCharCount: 0,
    };
  }

  if (elapsedMs < FIXING_END_MS) {
    const fixingProgress = (elapsedMs - FLAGGED_END_MS) / REVIEW_DEMO_FIXING_MS;

    return {
      phase: "fixing",
      typedCharCount: TOTAL_CODE_CHAR_COUNT,
      scanProgress: 1,
      fixedCharCount: Math.floor(
        fixingProgress * REVIEW_DEMO_FIXED_LINE.length,
      ),
    };
  }

  return REVIEW_DEMO_FINAL_FRAME;
}

/** Số ký tự đang hiện của từng dòng khi AI mới gõ được typedCharCount ký tự */
export function getVisibleLineLengths(
  codeLines: string[],
  typedCharCount: number,
): number[] {
  let remainingCharCount = typedCharCount;

  return codeLines.map((codeLine) => {
    const visibleLength = Math.max(
      0,
      Math.min(codeLine.length, remainingCharCount),
    );

    remainingCharCount -= codeLine.length;

    return visibleLength;
  });
}

/** Cắt các mẩu code đã tô màu, chỉ giữ visibleLength ký tự đầu */
export function sliceCodeTokens(
  codeTokens: CodeToken[],
  visibleLength: number,
): CodeToken[] {
  const visibleTokens: CodeToken[] = [];
  let remainingLength = visibleLength;

  for (const codeToken of codeTokens) {
    if (remainingLength <= 0) break;

    visibleTokens.push({
      ...codeToken,
      text: codeToken.text.slice(0, remainingLength),
    });
    remainingLength -= codeToken.text.length;
  }

  return visibleTokens;
}

/** Nền và viền trái của một dòng code theo kiểu của nó */
export function getReviewDemoLineClassName(
  lineTone: ReviewDemoLineTone,
): string {
  return cn(
    "relative flex px-4 transition-colors duration-300 sm:px-5",
    lineTone === "flagged" &&
      "bg-rose-500/15 shadow-[inset_2px_0_0_rgb(251_113_133)]",
    lineTone === "removed" &&
      "bg-rose-500/10 text-rose-200/70 line-through decoration-rose-300/60",
    lineTone === "added" &&
      "bg-emerald-500/15 shadow-[inset_2px_0_0_rgb(52_211_153)]",
  );
}

/** Dấu ở cột trước số dòng: "-" dòng bị xoá, "+" dòng thêm */
export function getReviewDemoLineSign(lineTone: ReviewDemoLineTone): string {
  if (lineTone === "removed") return "-";

  if (lineTone === "added") return "+";

  return " ";
}
