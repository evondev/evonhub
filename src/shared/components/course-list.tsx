"use client";
import CourseItemLoading from "./course-item-loading";

export interface CourseListProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export function CourseList({ children, isLoading }: CourseListProps) {
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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8">
      {child}
    </div>
  );
}
