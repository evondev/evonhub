"use client";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store";
import { Role } from "@/types/enums";
import React from "react";
import { useUserContext } from "../user-context";

interface LessonLayoutProps {
  children: React.ReactNode;
  courseId: string;
}
const LessonLayout = ({ children, courseId }: LessonLayoutProps) => {
  const { isExpanded } = useGlobalStore();
  const { userInfo } = useUserContext();
  const userCourses = userInfo?.courses
    ? JSON.parse(JSON.stringify(userInfo?.courses))
    : [];

  if (
    (!userCourses.includes(courseId) || !userInfo?._id) &&
    userInfo?.role !== Role.ADMIN
  )
    return null;
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
