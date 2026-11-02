import type { StepContainer } from "./lesson";

export interface Milestone extends StepContainer {
  number: number;
  stage: string;
  // Tính năng Evonhub thật mà mốc dựng lại.
  feature: string;
  // Vấn đề sẽ vấp phải khi làm mốc này, hiện ở lộ trình.
  problem: string;
  summary: string;
  minutes: number;
  // Màn GonnaCrash chơi trước để có trực giác về lỗi sắp gặp.
  gameLevels?: string[];
  // Cách bắn tải vào api/ local để thấy lỗi đó trên Evonhub.
  loadTest?: string;
}

export interface UpcomingMilestone {
  number: number;
  stage: string;
  title: string;
  problem: string;
  gameLevels?: string[];
  loadTest?: string;
}
