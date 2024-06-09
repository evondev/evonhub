"use client";
import { useGlobalStore } from "@/store";
import React from "react";

const LessonDesktopAside = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded, toggleExpanded } = useGlobalStore();
  if (isExpanded) return null;
  return (
    <div className="mt-2 flex-1 overflow-hidden lg:overflow-visible h-full lg:h-auto w-full sticky top-10 xl:top-[112px] right-0">
      {children}
    </div>
  );
};

export default LessonDesktopAside;
