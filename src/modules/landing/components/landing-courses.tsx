import { Button } from "@/components/ui/button";
import { CourseItem } from "@/modules/course/components";
import { CourseItemData } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  LANDING_CONTAINER_CLASS_NAME,
  LANDING_COURSE_SHOWCASE_LIMIT,
  LANDING_SECTION_CLASS_NAME,
  LANDING_SECTION_IDS,
} from "../constants";
import { sortCoursesByStudyCount } from "../utils";
import { LandingSectionHeading } from "./landing-section-heading";

interface LandingCoursesProps {
  courses: CourseItemData[];
}

/** Các khóa đang bán, nhiều lượt học đứng trước; chưa có khóa nào thì ẩn */
export function LandingCourses({ courses }: LandingCoursesProps) {
  if (courses.length === 0) return null;

  const showcaseCourses = sortCoursesByStudyCount(courses).slice(
    0,
    LANDING_COURSE_SHOWCASE_LIMIT,
  );

  return (
    <section
      id={LANDING_SECTION_IDS.courses}
      className={cn(LANDING_SECTION_CLASS_NAME, LANDING_CONTAINER_CLASS_NAME)}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <LandingSectionHeading
          eyebrow="Khóa học"
          title="Học đúng thứ đang dùng."
          mutedTitle="Từ nền tảng tới dự án thật."
        />
        <Button
          asChild
          variant="outline"
          className="shrink-0 self-start rounded-full sm:self-auto"
        >
          <Link href="/explore">
            Xem tất cả khóa học
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="reveal-on-scroll mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showcaseCourses.map((course) => (
          <CourseItem key={course._id} data={course} shouldHideInfo={false} />
        ))}
      </div>
    </section>
  );
}
