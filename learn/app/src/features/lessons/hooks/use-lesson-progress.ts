"use client";

import { createContext, useContext } from "react";
import type { StepProgress, StepProgressPatch } from "../types/progress";

export interface LessonProgressContextValue {
  lessonSlug: string;
  steps: Record<string, StepProgress>;
  saveStep: (stepId: string, patch: StepProgressPatch) => Promise<void>;
  setStepLocally: (stepId: string, patch: StepProgressPatch) => void;
}

export const LessonProgressContext = createContext<LessonProgressContextValue | null>(null);

export function useLessonProgress() {
  const contextValue = useContext(LessonProgressContext);

  if (!contextValue) {
    throw new Error("useLessonProgress phải nằm trong LessonProgressProvider.");
  }

  return contextValue;
}
