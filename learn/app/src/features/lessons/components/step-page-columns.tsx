"use client";

import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { useWorkbench } from "../hooks/use-workbench";

interface StepPageColumnsProps {
  hasWorkbench: boolean;
  workbench: ReactNode;
  children: ReactNode;
}

// Từ 1280px chia hai cột: đề bài trái, bàn làm việc phải (rộng hơn từ 1536px để code không chật).
// Dưới 1280px, hoặc bàn làm việc đang gập: một cột, phần chạy nằm ngay trong từng bước.
export default function StepPageColumns({ hasWorkbench, workbench, children }: StepPageColumnsProps) {
  const { isCollapsed } = useWorkbench();
  const isWorkbenchShown = hasWorkbench && !isCollapsed;

  return (
    <div
      className={cn(
        "mx-auto grid w-full grid-cols-1 gap-6 p-4 sm:p-6",
        isWorkbenchShown && "max-w-[1600px] xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_520px]",
        !isWorkbenchShown && "max-w-4xl",
      )}
    >
      <main className="min-w-0 space-y-12 pb-24">{children}</main>
      {isWorkbenchShown && (
        <aside className="hidden xl:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">{workbench}</div>
        </aside>
      )}
    </div>
  );
}
