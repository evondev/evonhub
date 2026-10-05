import { CourseItemData } from "@/modules/course/types";
import { Suspense } from "react";
import { CATALOG_GRID_LIMIT } from "../constants";
import { buildCatalogStats, buildRoadmapSteps } from "../utils";
import { BrandHero } from "./brand-hero";
import { CourseGridSection } from "./course-grid-section";
import { PartnerFooter } from "./partner-footer";
import { RoadmapSection } from "./roadmap-section";
import { TestimonialsSection } from "./testimonials-section";

interface OutsiderDashboardProps {
  /** Có tên là người đã đăng nhập nhưng chưa có khóa; không có là khách */
  firstName?: string;
  catalogCourses: CourseItemData[];
}

export function OutsiderDashboard({
  firstName,
  catalogCourses,
}: OutsiderDashboardProps) {
  const stats = buildCatalogStats(catalogCourses);

  return (
    <div className="flex flex-col gap-4">
      <BrandHero firstName={firstName} stats={stats} />
      <div className="mt-4">
        <RoadmapSection steps={buildRoadmapSteps(catalogCourses)} />
      </div>
      <div className="mt-4">
        <CourseGridSection
          title="Tất cả khóa học"
          courses={catalogCourses.slice(0, CATALOG_GRID_LIMIT)}
        />
      </div>
      <div className="mt-4">
        <Suspense fallback={null}>
          <TestimonialsSection stats={stats} />
        </Suspense>
      </div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
