import { cn } from "@/shared/utils";
import { CourseItemResumeLoading } from "./course-item-resume-loading";

export interface CourseResumeListProps {
  children?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function CourseResumeList({
  children,
  isLoading,
  className,
}: CourseResumeListProps) {
  const child = isLoading ? (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <CourseItemResumeLoading key={index} />
        ))}
    </>
  ) : (
    children
  );
  return (
    <div className={cn("grid lg:grid-cols-2 gap-6", className)}>{child}</div>
  );
}
