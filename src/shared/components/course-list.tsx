export interface CourseListProps {
  children: React.ReactNode;
}

export function CourseList({ children }: CourseListProps) {
  return (
    <div className="grid xl:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 course-slider">
      {children}
    </div>
  );
}
