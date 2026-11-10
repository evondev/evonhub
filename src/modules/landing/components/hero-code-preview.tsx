import {
  HERO_CODE_FILE_NAME,
  HERO_CODE_LINES,
  HERO_CODE_WARNING_TEXT,
  HERO_CODE_WARNING_TITLE,
} from "@/shared/constants/hero-code.constants";
import { cn } from "@/shared/utils";
import { TriangleAlert } from "lucide-react";
import {
  HERO_CODE_FIRST_LINE_DELAY_MS,
  HERO_CODE_LINE_DELAY_MS,
} from "../constants";
import { CodeLineTokens } from "./code-line-tokens";

/**
 * Đoạn code AI viết có lỗ hổng, minh hoạ tiêu đề hero. Khung editor luôn tối
 * ở cả hai giao diện, như cửa sổ code thật
 */
export function HeroCodePreview() {
  const warningDelayMs =
    HERO_CODE_FIRST_LINE_DELAY_MS +
    HERO_CODE_LINES.length * HERO_CODE_LINE_DELAY_MS;

  return (
    <div
      aria-hidden="true"
      className="rounded-2xl bg-surface/70 p-1.5 shadow-popover ring-1 ring-border-strong backdrop-blur-md"
    >
      <div className="flex flex-col overflow-hidden rounded-xl bg-gray-950 text-gray-200 ring-1 ring-white/10">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </div>
          <span className="truncate font-mono text-xs text-gray-400">
            {HERO_CODE_FILE_NAME}
          </span>
        </div>
        <div className="flex flex-1 flex-col py-4 font-mono text-[13px] leading-6">
          <div className="mb-4">
            {HERO_CODE_LINES.map((codeLine, index) => (
              <div
                key={index}
                className={cn(
                  "flex px-4 motion-safe:animate-line-in sm:px-5",
                  codeLine.isFlagged && "bg-amber-400/15",
                )}
                style={{
                  animationDelay: `${HERO_CODE_FIRST_LINE_DELAY_MS + index * HERO_CODE_LINE_DELAY_MS}ms`,
                }}
              >
                <span
                  className={cn(
                    "w-6 shrink-0 select-none pr-3 text-right",
                    codeLine.isFlagged && "text-amber-300",
                    !codeLine.isFlagged && "text-gray-400",
                  )}
                >
                  {index + 1}
                </span>
                <code className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">
                  <CodeLineTokens code={codeLine.code} />
                </code>
              </div>
            ))}
          </div>
          <div
            className="mx-4 flex items-start gap-2 rounded-lg bg-white/10 px-3 py-2 font-sans text-xs leading-5 text-white motion-safe:animate-hero-rise sm:mx-5"
            style={{ animationDelay: `${warningDelayMs}ms` }}
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-300" />
            <span>
              <b className="font-semibold">{HERO_CODE_WARNING_TITLE}</b>{" "}
              {HERO_CODE_WARNING_TEXT}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
