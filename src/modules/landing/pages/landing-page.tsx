import { fetchCourses } from "@/modules/course/actions";
import { buildCatalogStats } from "@/modules/course/utils";
import { CourseStatus } from "@/shared/constants/course.constants";
import { Suspense } from "react";
import {
  LandingCourses,
  LandingFaq,
  LandingFeatures,
  LandingFinalCta,
  LandingHero,
  LandingInstructor,
  LandingPurchaseSteps,
  LandingStats,
  LandingTechMarquee,
  LandingTestimonials,
} from "../components";
import { LANDING_COURSE_LIMIT } from "../constants";
import { buildLandingStatItems } from "../utils";

export async function LandingPage() {
  // Khóa đang bán, mới nhất đứng đầu (fetchCourses xếp theo ngày tạo giảm dần)
  const courses =
    (await fetchCourses({
      status: CourseStatus.Approved,
      limit: LANDING_COURSE_LIMIT,
      isAll: false,
    })) || [];
  const stats = buildCatalogStats(courses);

  return (
    <>
      <LandingHero newestCourse={courses[0]} stats={stats} />
      <LandingTechMarquee />
      <LandingStats statItems={buildLandingStatItems(stats)} />
      <LandingFeatures />
      <LandingCourses courses={courses} />
      <LandingInstructor />
      <Suspense fallback={null}>
        <LandingTestimonials />
      </Suspense>
      <LandingPurchaseSteps />
      <LandingFaq />
      <LandingFinalCta freeCourseCount={stats.freeCourseCount} />
    </>
  );
}
