import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import type { TaskRunResult } from "../types/task-run";
import MarkdownText from "./markdown-text";

interface TaskResultPanelProps {
  result: TaskRunResult;
  afterPass?: string;
}

export default function TaskResultPanel({ result, afterPass }: TaskResultPanelProps) {
  const passedCount = result.checks.filter((check) => check.isPassed).length;

  return (
    <div className="space-y-3 rounded-xl border border-border-strong bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-sm font-medium", result.isPassed && "text-emerald-700", !result.isPassed && "text-red-700")}>
          {result.isPassed ? "Đạt" : "Chưa đạt"}
          <span className="font-normal text-muted">
            {" "}
            · {passedCount}/{result.checks.length} xanh
          </span>
        </p>
        <span className="text-xs text-muted">Chạy mất {(result.durationMs / 1000).toFixed(1)} giây</span>
      </div>

      <ul className="space-y-1.5">
        {result.checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2.5 text-sm">
            {check.isPassed && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden />}
            {!check.isPassed && <XCircle className="mt-0.5 size-4 shrink-0 text-red-700" aria-hidden />}
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {check.label}
              {check.detail && <span className="text-muted"> · {check.detail}</span>}
            </span>
          </li>
        ))}
      </ul>

      {result.output && (
        <pre className="max-h-80 overflow-auto rounded-xl bg-background px-4 py-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {result.output}
        </pre>
      )}

      {result.isPassed && afterPass && (
        <MarkdownText content={afterPass} className="border-t border-border-strong pt-3 text-muted" />
      )}
    </div>
  );
}
