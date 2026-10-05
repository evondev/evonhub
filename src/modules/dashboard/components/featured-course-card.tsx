import { CourseItemData } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { CourseCover } from "@/shared/components/course";
import { CoursePrice, CourseRating } from "@/modules/course/components";

interface FeaturedCourseCardProps {
  course: CourseItemData;
  /** Không có khóa nào khác bên cạnh thì card trải hết hàng */
  isFullWidth: boolean;
}

export function FeaturedCourseCard({
  course,
  isFullWidth,
}: FeaturedCourseCardProps) {
  return (
    <Link
      href={`/course/${course.slug}`}
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface outline-none transition-colors hover:border-border-strong sm:flex-row",
        isFullWidth && "lg:col-span-3",
        !isFullWidth && "lg:col-span-2",
      )}
    >
      <CourseCover
        image={course.image}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-video w-full shrink-0 sm:aspect-auto sm:min-h-64 sm:w-1/2"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
        <span className="text-xs font-medium text-primary-strong">
          Đang mở đăng ký
        </span>
        <h3 className="text-pretty text-lg font-semibold text-foreground">
          {course.title}
        </h3>
        {course.desc && (
          <p className="line-clamp-3 text-pretty text-sm text-muted">
            {course.desc}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <CoursePrice course={course} />
          <CourseRating ratings={course.rating} />
        </div>
      </div>
    </Link>
  );
}
