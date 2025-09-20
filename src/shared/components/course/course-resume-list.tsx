import { CourseItemResumeLoading } from "./course-item-resume-loading";

export interface CourseResumeListProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

export function CourseResumeList({
  children,
  isLoading,
}: CourseResumeListProps) {
  const child = isLoading ? (
    <>
      {Array(2)
        .fill(0)
        .map((_, index) => (
          <CourseItemResumeLoading key={index} />
        ))}
    </>
  ) : (
    children
  );
  return <div className="flex flex-col gap-5">{child}</div>;
}
