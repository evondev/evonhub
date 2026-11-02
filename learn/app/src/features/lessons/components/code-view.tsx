import { FileCode2 } from "lucide-react";
import { cn } from "@/utils/cn";
import type { CodeSnippet } from "../types/lesson";
import { highlightCodeLines } from "../utils/highlight-code";

interface CodeViewProps {
  code: CodeSnippet;
  activeLines?: number[];
  className?: string;
}

export default function CodeView({ code, activeLines = [], className }: CodeViewProps) {
  const highlightedLines = highlightCodeLines(code.source);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border-strong bg-surface", className)}>
      <div className="flex items-center gap-2 border-b border-border-strong px-4 py-2 text-xs text-muted">
        <FileCode2 className="size-3.5 shrink-0" aria-hidden />
        <span className="font-mono">{code.fileName}</span>
      </div>
      <pre className="overflow-x-auto py-3 font-mono text-[13px] leading-relaxed">
        {highlightedLines.map((lineHtml, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const isActive = activeLines.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={cn(
                "flex border-l-2 border-transparent pr-4 transition-colors",
                isActive && "border-primary bg-foreground/[0.06]",
              )}
            >
              <span className="w-10 shrink-0 pr-3 text-right text-muted select-none">{lineNumber}</span>
              <code dangerouslySetInnerHTML={{ __html: lineHtml || " " }} />
            </div>
          );
        })}
      </pre>
    </div>
  );
}
