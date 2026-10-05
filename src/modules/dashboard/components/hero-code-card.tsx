import { cn } from "@/shared/utils";
import { TriangleAlert } from "lucide-react";
import {
  HERO_CODE_FILE_NAME,
  HERO_CODE_LINES,
  HERO_CODE_WARNING_TEXT,
  HERO_CODE_WARNING_TITLE,
} from "../constants";

/** Đoạn code AI viết có lỗ hổng, minh hoạ câu "hậu quả thì bạn chịu". Chỉ hiện từ lg */
export function HeroCodeCard() {
  return (
    <div
      aria-hidden="true"
      className="hidden min-w-0 overflow-hidden rounded-xl bg-black/30 font-mono text-[13px] leading-6 ring-1 ring-white/10 lg:block"
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="size-2.5 rounded-full bg-white/25" />
        <span className="ml-2 text-xs text-white/90">
          {HERO_CODE_FILE_NAME}
        </span>
      </div>
      <div className="py-3">
        {HERO_CODE_LINES.map((codeLine, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 px-4",
              codeLine.isFlagged && "bg-amber-400/20",
            )}
          >
            <span
              className={cn(
                "w-4 shrink-0 select-none text-right",
                codeLine.isFlagged && "text-white",
                !codeLine.isFlagged && "text-white/75",
              )}
            >
              {index + 1}
            </span>
            <code className="min-w-0 whitespace-pre text-white/90">
              {codeLine.code}
            </code>
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 flex items-start gap-2 rounded-lg bg-white/10 px-3 py-2 font-sans text-xs text-white">
        <TriangleAlert className="mt-px size-4 shrink-0 text-amber-300" />
        <span>
          <b className="font-semibold">{HERO_CODE_WARNING_TITLE}</b>{" "}
          {HERO_CODE_WARNING_TEXT}
        </span>
      </div>
    </div>
  );
}
