import type { LucideIcon } from "lucide-react";

// Ba nhóm bước, mỗi nhóm một sắc cố định trên mọi trang: xem (hiểu), nghĩ (tự suy), làm (chạy code).
export type StepTone = "xem" | "nghi" | "lam";

export interface StepKindStyle {
  icon: LucideIcon;
  tone: StepTone;
}

export interface StepToneClasses {
  cell: string;
  icon: string;
}
