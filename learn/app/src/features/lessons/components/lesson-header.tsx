"use client";

import Link from "next/link";
import { ArrowLeft, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/button";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import { useWorkbench } from "../hooks/use-workbench";
import type { StepContainer } from "../types/lesson";
import type { BackLink } from "../types/navigation";
import { countLessonProgress } from "../utils/lesson-progress";

interface LessonHeaderProps {
  heading: string;
  container: StepContainer;
  backLink: BackLink;
}

export default function LessonHeader({ heading, container, backLink }: LessonHeaderProps) {
  const { steps } = useLessonProgress();
  const { workbenchSteps, isCollapsed, toggleCollapsed } = useWorkbench();
  const { doneCount, totalCount } = countLessonProgress(container, { steps });
  const progressPercent = Math.round((doneCount / totalCount) * 100);
  const canReopenWorkbench = workbenchSteps.length > 0 && isCollapsed;

  return (
    <header className="sticky top-0 z-20 border-b border-border-strong bg-surface">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
        <Link
          href={backLink.href}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted transition-colors hover:bg-item-hover hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">{backLink.label}</span>
        </Link>
        <span className="min-w-0 truncate text-sm font-medium">{heading}</span>
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-secondary sm:block">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-xs whitespace-nowrap text-muted">
            {doneCount}/{totalCount} bước
          </span>
          {canReopenWorkbench && (
            <Button variant="outline" icon={PanelRightOpen} onClick={toggleCollapsed} className="hidden xl:inline-flex">
              Mở bàn làm việc
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
