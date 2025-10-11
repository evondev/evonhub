import { CourseResume } from "./(dashboard-components)/course-resume";
import { CourseSuggestion } from "./(dashboard-components)/course-suggestion";
import { Leaderboard } from "./(dashboard-components)/leaderboard";

export interface DashboardPageRootProps {}

export default function DashboardPageRoot(_props: DashboardPageRootProps) {
  return (
    <div className="flex flex-col md:grid grid-cols-[minmax(0,1fr),300px] gap-6 items-start">
      <div className="flex flex-col gap-6 w-full">
        <CourseResume />
        <CourseSuggestion />
      </div>
      <Leaderboard />
    </div>
  );
}
