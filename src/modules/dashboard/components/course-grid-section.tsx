import { CourseItem } from "@/modules/course/components";
import { CourseItemData } from "@/modules/course/types";
import { SectionHeading } from "./section-heading";

interface CourseGridSectionProps {
  title: string;
  courses: CourseItemData[];
}

export function CourseGridSection({ title, courses }: CourseGridSectionProps) {
  if (courses.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <SectionHeading
        title={title}
        linkText="Khám phá thêm"
        linkHref="/explore"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseItem key={course._id} data={course} shouldHideInfo={false} />
        ))}
      </div>
    </section>
  );
}
