"use client";

import { FlaskConical } from "lucide-react";
import { Button } from "@/components/button";
import { useWorkbench } from "../hooks/use-workbench";
import type { AcceptanceStep } from "../types/lesson";
import TaskResultPanel from "./task-result-panel";
import TodoFileList from "./todo-file-list";

interface AcceptanceRunnerProps {
  step: AcceptanceStep;
  isCompact?: boolean;
}

// File TODO cần viết, nút chạy test chấp nhận, kết quả xanh/đỏ.
export default function AcceptanceRunner({ step, isCompact = false }: AcceptanceRunnerProps) {
  const { readRunState, runStep } = useWorkbench();
  const { isRunning, result, runError } = readRunState(step.id);

  return (
    <div className="space-y-4">
      <TodoFileList todoFiles={step.todoFiles} isCompact={isCompact} />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" icon={FlaskConical} isLoading={isRunning} onClick={() => runStep(step.id)}>
          Chạy test
        </Button>
        {isRunning && <span className="text-xs text-muted">Đang build và chạy test trong api/…</span>}
      </div>

      {runError && <p className="text-sm text-red-600">{runError}</p>}
      {result && <TaskResultPanel result={result} afterPass={step.afterPass} />}
    </div>
  );
}
