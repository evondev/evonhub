import type { AcceptanceStep, CodeTaskStep } from "./lesson";
import type { TaskRunResult } from "./task-run";

// Bước có thể đặt lên bàn làm việc: chạy code của bài lab, hoặc chạy test chấp nhận của mốc.
export type WorkbenchStep = CodeTaskStep | AcceptanceStep;

export interface WorkbenchRunState {
  isRunning: boolean;
  result: TaskRunResult | null;
  runError: string;
}
