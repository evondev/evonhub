import { CourseCover } from "@/shared/components/course";
import Link from "next/link";
import { CoursePrice, CourseRating } from "../../../components";
import { CourseItemData } from "../../../types";
import { formatCourseMeta } from "../../../utils";

interface ExploreCourseCardProps {
  course: CourseItemData;
}

/** Điện thoại: ảnh nhỏ bên trái. Từ sm: ảnh trên, chữ dưới */
export function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  return (
    <Link
      href={`/course/${course.slug}`}
      className="group flex min-w-0 overflow-hidden rounded-2xl border border-border bg-surface outline-none transition-colors hover:border-border-strong focus-visible:border-primary sm:flex-col"
    >
      <CourseCover
        image={course.image}
        sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 128px"
        className="m-3 aspect-video w-32 shrink-0 self-start rounded-lg sm:m-0 sm:w-full sm:rounded-none"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-3 pr-3 sm:p-4">
        <h3 className="line-clamp-2 text-pretty text-base font-semibold text-foreground">
          {course.title}
        </h3>
        <p className="text-xs text-muted">{formatCourseMeta(course)}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          <CoursePrice course={course} />
          <CourseRating ratings={course.rating} shouldShowCount />
        </div>
      </div>
    </Link>
  );
}
