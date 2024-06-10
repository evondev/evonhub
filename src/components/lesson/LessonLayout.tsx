"use client";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import React from "react";

const LessonLayout = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded } = useGlobalStore();
  return (
    <div
      className={cn(
        "flex flex-col lg:grid overflow-hidden lg:overflow-visible h-[calc(100svh-56px)] sm:h-auto grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-0 lg:gap-8 items-start transition-all relative -mx-5 -mb-7 lg:mb-0 lg:mx-0",
        isExpanded ? "!block" : "lg:grid"
      )}
    >
      {children}
    </div>
  );
};

export default LessonLayout;
