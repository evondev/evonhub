"use client";

import { cn } from "@/utils/cn";
import { useWorkbench } from "../hooks/use-workbench";
import type { AcceptanceStep } from "../types/lesson";
import AcceptanceRunner from "./acceptance-runner";
import HintList from "./hint-list";
import MarkdownText from "./markdown-text";
import TodoFileList from "./todo-file-list";
import WorkbenchPointer from "./workbench-pointer";

interface AcceptanceBlockProps {
  step: AcceptanceStep;
}

export default function AcceptanceBlock({ step }: AcceptanceBlockProps) {
  const { isCollapsed } = useWorkbench();

  return (
    <div className="space-y-4">
      <MarkdownText content={step.prompt} className="max-w-[75ch]" />
      {/* Màn rộng: đề bài giữ danh sách TODO đầy đủ (việc cần viết), nút chạy và kết quả ở bàn làm việc. */}
      <div className={cn("hidden space-y-4", !isCollapsed && "xl:block")}>
        <TodoFileList todoFiles={step.todoFiles} />
        <WorkbenchPointer stepId={step.id} label="Nút chạy test và kết quả" />
      </div>
      <div className={cn(!isCollapsed && "xl:hidden")}>
        <AcceptanceRunner step={step} />
      </div>
      <HintList hints={step.hints} />
    </div>
  );
}
