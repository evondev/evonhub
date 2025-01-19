import { Heading } from "@/shared/components";

export interface CourseSectionProps {
  children: React.ReactNode;
  title: string;
}

export default function CourseSection({ title, children }: CourseSectionProps) {
  if (!children) return null;
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <Heading
          squareClassName="size-4"
          className="text-base lg:text-lg font-bold mb-0"
        >
          {title}
        </Heading>
        <div className="text-slate-700 dark:text-text5 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
