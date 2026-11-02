"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PanelRightClose, Wrench } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import { stepToneClasses } from "../constants/step-kind-styles";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import { useWorkbench } from "../hooks/use-workbench";
import AcceptanceRunner from "./acceptance-runner";
import CodeTaskRunner from "./code-task-runner";

interface WorkbenchPanelProps {
  stepNumbers: Record<string, number>;
}

function getTabClasses(isActive: boolean) {
  return cn(
    "flex min-h-0 w-full items-center justify-start gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm font-normal",
    isActive && "bg-secondary font-medium text-foreground hover:bg-secondary hover:text-foreground",
    !isActive && "text-muted hover:bg-item-hover hover:text-foreground",
  );
}

// Cột phải: bước chạy code đang mở. Cuộn tới bước nào bên trái thì tự đổi sang bước đó.
export default function WorkbenchPanel({ stepNumbers }: WorkbenchPanelProps) {
  const { steps } = useLessonProgress();
  const { workbenchSteps, activeStepId, selectStep, toggleCollapsed } = useWorkbench();
  const activeStep = workbenchSteps.find((step) => step.id === activeStepId) ?? workbenchSteps[0];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2.5 text-sm font-semibold">
          <span className={cn("flex size-8 items-center justify-center rounded-lg", stepToneClasses.lam.cell)}>
            <Wrench className="size-4" aria-hidden />
          </span>
          Bàn làm việc
        </p>
        <Button
          variant="ghost"
          icon={PanelRightClose}
          onClick={toggleCollapsed}
          className="min-h-8 px-2.5 py-1 text-xs"
          aria-label="Gập bàn làm việc"
        >
          Gập
        </Button>
      </div>

      {workbenchSteps.length > 1 && (
        <ul className="flex flex-col gap-1">
          {workbenchSteps.map((step) => {
            const isDone = Boolean(steps[step.id]?.isDone);

            return (
              <li key={step.id}>
                <Button
                  variant="ghost"
                  aria-current={step.id === activeStep.id ? "step" : undefined}
                  onClick={() => selectStep(step.id)}
                  className={getTabClasses(step.id === activeStep.id)}
                >
                  {isDone && <CheckCircle2 className="size-4 shrink-0 text-emerald-700" aria-hidden />}
                  {!isDone && <Circle className="size-4 shrink-0 text-muted/60" aria-hidden />}
                  <span className="truncate">
                    {String(stepNumbers[step.id]).padStart(2, "0")} · {step.title}
                  </span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="space-y-3 border-t border-border pt-4">
        <Link href={`#${activeStep.id}`} className="block text-xs font-medium text-muted hover:text-foreground">
          Đề ở bước {String(stepNumbers[activeStep.id]).padStart(2, "0")} · {activeStep.title}
        </Link>
        {activeStep.kind === "code-task" && <CodeTaskRunner key={activeStep.id} step={activeStep} />}
        {activeStep.kind === "acceptance" && <AcceptanceRunner key={activeStep.id} step={activeStep} isCompact />}
      </div>
    </div>
  );
}
