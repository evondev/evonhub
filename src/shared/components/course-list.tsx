"use client";
import { cn } from "@/lib/utils";
import CourseItemLoading from "./course-item-loading";

export interface CourseListProps {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function CourseList({
  children,
  isLoading,
  className,
}: CourseListProps) {
  const child = isLoading ? (
    <>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <CourseItemLoading key={index} />
        ))}
    </>
  ) : (
    children
  );
  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8",
        className
      )}
    >
      {child}
    </div>
  );
}
