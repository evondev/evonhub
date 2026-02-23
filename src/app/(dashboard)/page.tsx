import { Banner } from "./(dashboard-components)/banner";
import { CourseResume } from "./(dashboard-components)/course-resume";
import { CourseSuggestion } from "./(dashboard-components)/course-suggestion";
import { Partner } from "./(dashboard-components)/partner";
import { Welcome } from "./(dashboard-components)/welcome";

export interface DashboardPageRootProps {}

export default function DashboardPageRoot(_props: DashboardPageRootProps) {
  return (
    <div className="flex flex-col md:grid grid-cols-[minmax(0,1fr),300px] gap-6 items-start">
      <div className="flex flex-col gap-10 w-full">
        <Welcome />
        <Banner />
        <CourseResume />
        <CourseSuggestion />
      </div>
      <Partner />
    </div>
  );
}
