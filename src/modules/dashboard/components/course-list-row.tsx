import { CourseItemData } from "@/modules/course/types";
import Link from "next/link";
import { CourseCover } from "@/shared/components/course";
import { CoursePrice } from "./course-price";

interface CourseListRowProps {
  course: CourseItemData;
}

export function CourseListRow({ course }: CourseListRowProps) {
  return (
    <li>
      <Link
        href={`/course/${course.slug}`}
        className="flex min-w-0 items-center gap-3 rounded-xl p-2 outline-none transition-colors hover:bg-item-hover"
      >
        <CourseCover
          image={course.image}
          sizes="96px"
          className="aspect-video w-24 shrink-0 rounded-lg"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
            {course.title}
          </h3>
          <CoursePrice course={course} />
        </div>
      </Link>
    </li>
  );
}
