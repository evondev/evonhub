import { CourseItemData } from "@/modules/course/types";
import { CATALOG_LIST_LIMIT } from "../constants";
import { ComingSoonPanel } from "./coming-soon-panel";
import { CourseListRow } from "./course-list-row";
import { FeaturedCourseCard } from "./featured-course-card";
import { SectionHeading } from "./section-heading";

interface CourseCatalogSectionProps {
  courses: CourseItemData[];
}

/** Một khóa lớn và danh sách bên cạnh: 1 hay 10 khóa cũng không lẻ card */
export function CourseCatalogSection({ courses }: CourseCatalogSectionProps) {
  if (courses.length === 0) return <ComingSoonPanel />;

  const [featuredCourse, ...otherCourses] = courses;
  const listedCourses = otherCourses.slice(0, CATALOG_LIST_LIMIT);

  return (
    <section id="khoa-hoc" className="flex scroll-mt-20 flex-col gap-4">
      <SectionHeading
        title="Khóa học"
        linkText="Xem tất cả"
        linkHref="/explore"
      />
      <div className="grid gap-3 lg:grid-cols-3">
        <FeaturedCourseCard
          course={featuredCourse}
          isFullWidth={listedCourses.length === 0}
        />
        {listedCourses.length > 0 && (
          <div className="min-w-0 rounded-2xl border border-border bg-surface p-2">
            <ul className="flex flex-col">
              {listedCourses.map((course) => (
                <CourseListRow key={course._id} course={course} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
