"use client";

import { createContext, useContext } from "react";
import type { WorkbenchRunState, WorkbenchStep } from "../types/workbench";

export interface WorkbenchContextValue {
  workbenchSteps: WorkbenchStep[];
  activeStepId: string | null;
  isCollapsed: boolean;
  selectStep: (stepId: string) => void;
  toggleCollapsed: () => void;
  readCode: (stepId: string) => string;
  changeCode: (stepId: string, nextCode: string) => void;
  readRunState: (stepId: string) => WorkbenchRunState;
  runStep: (stepId: string) => Promise<void>;
}

export const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function useWorkbench() {
  const contextValue = useContext(WorkbenchContext);

  if (!contextValue) {
    throw new Error("useWorkbench phải nằm trong WorkbenchProvider.");
  }

  return contextValue;
}
