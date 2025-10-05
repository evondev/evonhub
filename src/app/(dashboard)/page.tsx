import { CourseResume } from "./(dashboard-components)/course-resume";
import { CourseSuggestion } from "./(dashboard-components)/course-suggestion";
import { Leaderboard } from "./(dashboard-components)/leaderboard";
import { Welcome } from "./(dashboard-components)/welcome";

export interface DashboardPageRootProps {}

export default function DashboardPageRoot(_props: DashboardPageRootProps) {
  return (
    <div className="flex flex-col md:grid grid-cols-[minmax(0,1fr),300px] gap-8 items-start">
      <div className="flex flex-col gap-8 w-full">
        <Welcome />
        <CourseResume />
        <CourseSuggestion />
      </div>
      <Leaderboard />
    </div>
  );
}
