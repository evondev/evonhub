"use client";

import { cn } from "@/utils/cn";
import { useWorkbench } from "../hooks/use-workbench";
import type { CodeTaskStep } from "../types/lesson";
import CodeTaskRunner from "./code-task-runner";
import HintList from "./hint-list";
import MarkdownText from "./markdown-text";
import WorkbenchPointer from "./workbench-pointer";

interface CodeTaskBlockProps {
  step: CodeTaskStep;
}

export default function CodeTaskBlock({ step }: CodeTaskBlockProps) {
  const { isCollapsed } = useWorkbench();

  return (
    <div className="space-y-4">
      <MarkdownText content={step.prompt} />
      <WorkbenchPointer stepId={step.id} label="Code và nút Chạy" />
      {/* Màn hẹp, hoặc bàn làm việc đang gập: chạy ngay trong bước. */}
      <div className={cn(!isCollapsed && "xl:hidden")}>
        <CodeTaskRunner step={step} />
      </div>
      <HintList hints={step.hints} />
    </div>
  );
}
