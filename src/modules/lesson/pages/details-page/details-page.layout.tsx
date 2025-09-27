"use client";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";

export interface DetailsPageLayoutProps {
  children: React.ReactNode;
}

export function DetailsPageLayout({ children }: DetailsPageLayoutProps) {
  const { isExpanded } = useGlobalStore();

  return (
    <div
      className={cn(
        "-mt-8 lg:mt-0 flex flex-col lg:grid overflow-hidden lg:overflow-visible h-[calc(100svh-140px)] sm:h-auto grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-0 lg:gap-8 items-start transition-all relative -mx-5 -mb-7 lg:mb-0 lg:mx-0",
        isExpanded ? "!flex !gap-5" : "lg:grid"
      )}
    >
      {children}
    </div>
  );
}
