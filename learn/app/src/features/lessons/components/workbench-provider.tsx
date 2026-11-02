"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { runAcceptanceAction } from "../actions/run-acceptance-action";
import { runTaskAction } from "../actions/run-task-action";
import { useCollapsedWorkbench } from "../hooks/use-collapsed-workbench";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import { WorkbenchContext } from "../hooks/use-workbench";
import type { WorkbenchRunState, WorkbenchStep } from "../types/workbench";

interface WorkbenchProviderProps {
  workbenchSteps: WorkbenchStep[];
  children: ReactNode;
}

const idleRunState: WorkbenchRunState = { isRunning: false, result: null, runError: "" };

// Cột trái (đề bài) và cột phải (bàn làm việc) cùng hiện một bước chạy code: state nằm ở đây
// để sửa code bên này thì bên kia thấy ngay, chạy ở đâu cũng ra cùng một kết quả.
export default function WorkbenchProvider({ workbenchSteps, children }: WorkbenchProviderProps) {
  const { lessonSlug, steps, setStepLocally } = useLessonProgress();
  const [activeStepId, setActiveStepId] = useState(workbenchSteps[0]?.id ?? null);
  const { isCollapsed, toggleCollapsed } = useCollapsedWorkbench();
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      workbenchSteps.flatMap((step) =>
        step.kind === "code-task" ? [[step.id, steps[step.id]?.code ?? step.code.source]] : [],
      ),
    ),
  );
  const [runStateByStep, setRunStateByStep] = useState<Record<string, WorkbenchRunState>>({});

  // Cuộn tới bước chạy code nào thì bàn làm việc mở bước đó.
  useEffect(() => {
    const sections = workbenchSteps.flatMap((step) => document.getElementById(step.id) ?? []);
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) setActiveStepId(visibleEntry.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [workbenchSteps]);

  const readCode = useCallback((stepId: string) => codeByStep[stepId] ?? "", [codeByStep]);

  const changeCode = useCallback((stepId: string, nextCode: string) => {
    setCodeByStep((previousCode) => ({ ...previousCode, [stepId]: nextCode }));
  }, []);

  const readRunState = useCallback((stepId: string) => runStateByStep[stepId] ?? idleRunState, [runStateByStep]);

  const runStep = useCallback(
    async (stepId: string) => {
      const step = workbenchSteps.find((candidate) => candidate.id === stepId);
      if (!step) return;

      // Xoá kết quả cũ để không ai đọc nhầm kết quả lần trước trong lúc đang chạy lại.
      setRunStateByStep((previousStates) => ({ ...previousStates, [stepId]: { ...idleRunState, isRunning: true } }));

      try {
        const code = codeByStep[stepId] ?? "";
        const result =
          step.kind === "code-task"
            ? await runTaskAction(lessonSlug, stepId, code)
            : await runAcceptanceAction(lessonSlug, stepId);
        const passedCount = result.checks.filter((check) => check.isPassed).length;

        setRunStateByStep((previousStates) => ({ ...previousStates, [stepId]: { ...idleRunState, result } }));
        setStepLocally(stepId, {
          isDone: result.isPassed,
          code: step.kind === "code-task" && step.isEditable ? code : undefined,
          passedCount: step.kind === "acceptance" ? passedCount : undefined,
          checkCount: step.kind === "acceptance" ? result.checks.length : undefined,
        });
      } catch (error) {
        const runError = error instanceof Error ? error.message : "Không chạy được bước này.";
        setRunStateByStep((previousStates) => ({ ...previousStates, [stepId]: { ...idleRunState, runError } }));
      }
    },
    [codeByStep, lessonSlug, setStepLocally, workbenchSteps],
  );

  const contextValue = useMemo(
    () => ({
      workbenchSteps,
      activeStepId,
      isCollapsed,
      selectStep: setActiveStepId,
      toggleCollapsed,
      readCode,
      changeCode,
      readRunState,
      runStep,
    }),
    [workbenchSteps, activeStepId, isCollapsed, toggleCollapsed, readCode, changeCode, readRunState, runStep],
  );

  return <WorkbenchContext.Provider value={contextValue}>{children}</WorkbenchContext.Provider>;
}
