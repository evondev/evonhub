import { fetchCourses } from "@/modules/course/actions";
import { CourseStatus } from "@/shared/constants/course.constants";
import { CATALOG_COURSE_LIMIT } from "../constants";
import { OutsiderDashboard } from "./outsider-dashboard";

interface OutsiderOverviewProps {
  firstName?: string;
}

export async function OutsiderOverview({ firstName }: OutsiderOverviewProps) {
  const catalogCourses = await fetchCourses({
    status: CourseStatus.Approved,
    limit: CATALOG_COURSE_LIMIT,
    isAll: false,
  });

  return (
    <OutsiderDashboard
      firstName={firstName}
      catalogCourses={catalogCourses || []}
    />
  );
}
