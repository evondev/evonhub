"use client";

import { cn } from "@/shared/utils";
import { useRef } from "react";
import {
  REVIEW_DEMO_BUG_LINE_INDEX,
  REVIEW_DEMO_CODE_LINES,
  REVIEW_DEMO_FILE_NAME,
  REVIEW_DEMO_FIXED_LINE,
} from "../constants/review-demo.constants";
import { useReviewDemoTimeline } from "../hooks/use-review-demo-timeline";
import { getVisibleLineLengths } from "../utils/review-demo";
import { ReviewDemoCodeLine } from "./review-demo-code-line";
import { ReviewDemoMessage } from "./review-demo-message";
import { ReviewDemoStatus } from "./review-demo-status";

interface ReviewDemoEditorProps {
  /** Vệt sáng chạy quanh viền (bản tối neon) */
  hasBorderBeam?: boolean;
}

// Mỗi dòng code cao 28px (leading-7), thân editor đệm trên 16px
const CODE_LINE_HEIGHT_PX = 28;

const CODE_BODY_PADDING_TOP_PX = 16;

/**
 * Editor diễn đúng thông điệp hero: AI gõ code, bạn soát từng dòng, phát hiện
 * key ngẫu nhiên, sửa thành id, xong. Lặp lại liên tục
 */
export function ReviewDemoEditor({
  hasBorderBeam = false,
}: ReviewDemoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const frame = useReviewDemoTimeline(editorRef);
  const visibleLineLengths = getVisibleLineLengths(
    REVIEW_DEMO_CODE_LINES,
    frame.typedCharCount,
  );
  const typingLineIndex = visibleLineLengths.findIndex(
    (visibleLength, index) =>
      visibleLength < REVIEW_DEMO_CODE_LINES[index].length,
  );
  const isBugLineSplit = frame.phase === "fixing" || frame.phase === "done";
  const scanBarTop =
    CODE_BODY_PADDING_TOP_PX +
    frame.scanProgress * REVIEW_DEMO_BUG_LINE_INDEX * CODE_LINE_HEIGHT_PX;

  return (
    <div
      ref={editorRef}
      className={cn(
        "relative rounded-2xl bg-[#0b0a14]/95 text-left shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10 backdrop-blur-xl",
        hasBorderBeam && "border-beam",
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <span className="truncate font-mono text-xs text-gray-400">
            {REVIEW_DEMO_FILE_NAME}
          </span>
        </div>
        <ReviewDemoStatus phase={frame.phase} />
      </div>
      <div className="relative min-h-[12.5rem] py-4 font-mono text-[13px] leading-7 sm:text-sm sm:leading-7">
        {frame.phase === "reviewing" && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 h-7 border-y border-sky-400/40 bg-sky-400/10 shadow-[0_0_24px_rgb(56_189_248/0.35)]"
            style={{ top: scanBarTop }}
          />
        )}
        {REVIEW_DEMO_CODE_LINES.map((codeLine, lineIndex) => {
          const isBugLine = lineIndex === REVIEW_DEMO_BUG_LINE_INDEX;

          if (isBugLine && isBugLineSplit) {
            return (
              <div key={codeLine}>
                <ReviewDemoCodeLine
                  lineNumber={lineIndex + 1}
                  code={codeLine}
                  visibleLength={codeLine.length}
                  lineTone="removed"
                  hasCaret={false}
                />
                <ReviewDemoCodeLine
                  lineNumber={lineIndex + 1}
                  code={REVIEW_DEMO_FIXED_LINE}
                  visibleLength={frame.fixedCharCount}
                  lineTone="added"
                  hasCaret={frame.phase === "fixing"}
                />
              </div>
            );
          }

          return (
            <ReviewDemoCodeLine
              key={codeLine}
              lineNumber={lineIndex + 1}
              code={codeLine}
              visibleLength={visibleLineLengths[lineIndex]}
              lineTone={
                isBugLine && frame.phase === "flagged" ? "flagged" : "normal"
              }
              hasCaret={
                frame.phase === "typing" && typingLineIndex === lineIndex
              }
            />
          );
        })}
      </div>
      {/* Đệm nằm ở khối bọc chứ không phải margin của ô thông điệp: margin đáy
          của con cuối lọt ra ngoài editor, ô dính sát mép dưới */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <ReviewDemoMessage phase={frame.phase} />
      </div>
    </div>
  );
}
