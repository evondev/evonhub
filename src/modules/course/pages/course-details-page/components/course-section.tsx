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
        <Heading className="text-lg lg:text-xl font-bold mb-0">{title}</Heading>
        <div className="text-slate-700 dark:text-text5 leading-loose text-sm lg:text-base font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}
