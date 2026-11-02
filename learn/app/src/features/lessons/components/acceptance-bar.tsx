"use client";

import Link from "next/link";
import { CircleCheck, CircleX, FlaskConical } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import { useWorkbench } from "../hooks/use-workbench";
import type { AcceptanceStep } from "../types/lesson";

interface AcceptanceBarProps {
  step: AcceptanceStep;
  milestoneNumber: number;
}

// Màn hẹp hoặc bàn làm việc đang gập: thanh dính đáy, chạy lại test từ bất cứ đâu trên trang.
export default function AcceptanceBar({ step, milestoneNumber }: AcceptanceBarProps) {
  const { steps } = useLessonProgress();
  const { isCollapsed, readRunState, runStep } = useWorkbench();
  const { isRunning, result } = readRunState(step.id);
  const savedStep = steps[step.id];
  const passedCount = result ? result.checks.filter((check) => check.isPassed).length : savedStep?.passedCount;
  const checkCount = result ? result.checks.length : savedStep?.checkCount;
  const hasRun = checkCount !== undefined && passedCount !== undefined;
  const isPassed = hasRun && passedCount === checkCount;

  return (
    <div className={cn("sticky bottom-0 z-10 border-t border-border-strong bg-surface", !isCollapsed && "xl:hidden")}>
      <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:px-6">
        {!hasRun && <FlaskConical className="size-4 shrink-0 text-muted" aria-hidden />}
        {hasRun && isPassed && <CircleCheck className="size-4 shrink-0 text-emerald-700" aria-hidden />}
        {hasRun && !isPassed && <CircleX className="size-4 shrink-0 text-red-700" aria-hidden />}
        <Link href={`#${step.id}`} className="min-w-0 flex-1 truncate py-2 text-sm">
          <span className="font-medium">Test mốc {milestoneNumber}</span>
          <span className="text-muted"> · {hasRun ? `${passedCount}/${checkCount} xanh` : "chưa chạy"}</span>
        </Link>
        <Button variant="primary" icon={FlaskConical} isLoading={isRunning} onClick={() => runStep(step.id)}>
          Chạy test
        </Button>
      </div>
    </div>
  );
}
