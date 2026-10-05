"use client";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";

export interface DetailsPageLayoutProps {
  children: React.ReactNode;
}

// Hai cột từ lg: bài học bên trái, mục lục 380px bên phải. Ẩn mục lục
// (isExpanded) thì bài học chiếm hết bề ngang.
export function DetailsPageLayout({ children }: DetailsPageLayoutProps) {
  const { isExpanded } = useGlobalStore();

  return (
    <div
      className={cn(
        "lg:grid lg:items-start lg:gap-6",
        !isExpanded && "lg:grid-cols-[minmax(0,1fr)_380px]",
        isExpanded && "lg:grid-cols-1",
      )}
    >
      {children}
    </div>
  );
}
