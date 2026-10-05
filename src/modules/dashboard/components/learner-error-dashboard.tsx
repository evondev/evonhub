import { CourseItemData } from "@/modules/course/types";
import { CATALOG_GRID_LIMIT } from "../constants";
import { CourseGridSection } from "./course-grid-section";
import { LearnerLoadError } from "./learner-load-error";
import { PartnerFooter } from "./partner-footer";

interface LearnerErrorDashboardProps {
  catalogCourses: CourseItemData[];
}

export function LearnerErrorDashboard({
  catalogCourses,
}: LearnerErrorDashboardProps) {
  return (
    <div className="flex flex-col gap-4">
      <LearnerLoadError />
      <div className="mt-4">
        <CourseGridSection
          title="Tất cả khóa học"
          courses={catalogCourses.slice(0, CATALOG_GRID_LIMIT)}
        />
      </div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
