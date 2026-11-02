"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";
import { saveStepProgressAction } from "../actions/save-step-progress-action";
import { LessonProgressContext } from "../hooks/use-lesson-progress";
import type { LessonProgress, StepProgress, StepProgressPatch } from "../types/progress";

interface LessonProgressProviderProps {
  lessonSlug: string;
  initialProgress: LessonProgress;
  children: ReactNode;
}

function mergeStep(previousStep: StepProgress | undefined, patch: StepProgressPatch): StepProgress {
  return {
    ...previousStep,
    ...patch,
    isDone: Boolean(previousStep?.isDone || patch.isDone),
    updatedAt: new Date().toISOString(),
  };
}

export default function LessonProgressProvider({ lessonSlug, initialProgress, children }: LessonProgressProviderProps) {
  const [steps, setSteps] = useState(initialProgress.steps);

  const setStepLocally = useCallback((stepId: string, patch: StepProgressPatch) => {
    setSteps((previousSteps) => ({ ...previousSteps, [stepId]: mergeStep(previousSteps[stepId], patch) }));
  }, []);

  const saveStep = useCallback(
    async (stepId: string, patch: StepProgressPatch) => {
      setStepLocally(stepId, patch);
      const savedStep = await saveStepProgressAction(lessonSlug, stepId, patch);
      setSteps((previousSteps) => ({ ...previousSteps, [stepId]: savedStep }));
    },
    [lessonSlug, setStepLocally],
  );

  const contextValue = useMemo(
    () => ({ lessonSlug, steps, saveStep, setStepLocally }),
    [lessonSlug, steps, saveStep, setStepLocally],
  );

  return <LessonProgressContext.Provider value={contextValue}>{children}</LessonProgressContext.Provider>;
}
