"use client";

import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/button";
import { useWorkbench } from "../hooks/use-workbench";
import type { CodeTaskStep } from "../types/lesson";
import CodeEditor from "./code-editor";
import CodeView from "./code-view";
import TaskResultPanel from "./task-result-panel";

interface CodeTaskRunnerProps {
  step: CodeTaskStep;
}

// Phần chạy của một bài lab: code (sửa được hoặc chỉ đọc), nút Chạy, kết quả.
// Dùng ở cả hai chỗ: trong bước (màn hẹp) và trên bàn làm việc (màn rộng).
export default function CodeTaskRunner({ step }: CodeTaskRunnerProps) {
  const { readCode, changeCode, readRunState, runStep } = useWorkbench();
  const code = readCode(step.id);
  const { isRunning, result, runError } = readRunState(step.id);
  const isCodeChanged = code !== step.code.source;

  return (
    <div className="space-y-4">
      {step.isEditable && (
        <CodeEditor
          fileName={step.code.fileName}
          language={step.code.language}
          value={code}
          onChange={(nextCode) => changeCode(step.id, nextCode)}
        />
      )}
      {!step.isEditable && <CodeView code={step.code} />}

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" icon={Play} isLoading={isRunning} onClick={() => runStep(step.id)}>
          Chạy
        </Button>
        {step.isEditable && isCodeChanged && (
          <Button variant="ghost" icon={RotateCcw} onClick={() => changeCode(step.id, step.code.source)}>
            Về code ban đầu
          </Button>
        )}
        {isRunning && <span className="text-xs text-muted">Đang chạy trên máy bro…</span>}
      </div>

      {runError && <p className="text-sm text-red-600">{runError}</p>}
      {result && <TaskResultPanel result={result} afterPass={step.afterPass} />}
    </div>
  );
}
