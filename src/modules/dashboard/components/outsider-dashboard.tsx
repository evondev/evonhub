import { CourseItemData } from "@/modules/course/types";
import { Suspense } from "react";
import { RoadmapStepConfig } from "../types";
import {
  buildCatalogStats,
  buildHeroStatItems,
  buildRoadmapSteps,
  hasEnoughRoadmapSteps,
} from "../utils";
import { BrandHero } from "./brand-hero";
import { CourseCatalogSection } from "./course-catalog-section";
import { PartnerFooter } from "./partner-footer";
import { RoadmapSection } from "./roadmap-section";
import { TestimonialsSection } from "./testimonials-section";

interface OutsiderDashboardProps {
  /** Có tên là người đã đăng nhập nhưng chưa có khóa; không có là khách */
  firstName?: string;
  catalogCourses: CourseItemData[];
  /** Mặc định là ROADMAP_STEPS; trang xem trước truyền lộ trình giả */
  roadmapStepConfigs?: RoadmapStepConfig[];
}

export function OutsiderDashboard({
  firstName,
  catalogCourses,
  roadmapStepConfigs,
}: OutsiderDashboardProps) {
  const stats = buildCatalogStats(catalogCourses);
  const roadmapSteps = buildRoadmapSteps(
    catalogCourses,
    [],
    roadmapStepConfigs,
  );
  const hasRoadmap = hasEnoughRoadmapSteps(roadmapSteps);

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <BrandHero
        firstName={firstName}
        statItems={buildHeroStatItems(stats)}
        hasRoadmap={hasRoadmap}
        hasCourses={catalogCourses.length > 0}
      />
      {hasRoadmap && <RoadmapSection steps={roadmapSteps} />}
      <CourseCatalogSection courses={catalogCourses} />
      <Suspense fallback={null}>
        <TestimonialsSection stats={stats} />
      </Suspense>
      <PartnerFooter />
    </div>
  );
}
