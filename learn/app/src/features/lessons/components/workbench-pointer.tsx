"use client";

import { PanelRight } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { useWorkbench } from "../hooks/use-workbench";

interface WorkbenchPointerProps {
  stepId: string;
  label: string;
}

// Thay cho phần chạy trong bước khi bàn làm việc đang hiện bên phải: bấm để đưa bước này lên bàn.
export default function WorkbenchPointer({ stepId, label }: WorkbenchPointerProps) {
  const { activeStepId, isCollapsed, selectStep } = useWorkbench();
  const isActive = activeStepId === stepId;

  return (
    <div
      className={cn(
        "hidden items-center gap-3 rounded-xl border border-dashed border-border-strong px-4 py-3",
        !isCollapsed && "xl:flex",
      )}
    >
      <PanelRight className="size-4 shrink-0 text-muted" aria-hidden />
      <span className="min-w-0 flex-1 text-sm text-muted">
        {isActive ? `${label} đang mở ở bàn làm việc bên phải.` : `${label} nằm ở bàn làm việc bên phải.`}
      </span>
      {!isActive && (
        <Button variant="outline" onClick={() => selectStep(stepId)}>
          Mở ở bàn làm việc
        </Button>
      )}
    </div>
  );
}
