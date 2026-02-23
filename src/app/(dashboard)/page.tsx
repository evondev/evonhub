import { Banner } from "./(dashboard-components)/banner";
import { CourseResume } from "./(dashboard-components)/course-resume";
import { CourseSuggestion } from "./(dashboard-components)/course-suggestion";
import { FAQ } from "./(dashboard-components)/faq";
import { Partner } from "./(dashboard-components)/partner";
import { Rating } from "./(dashboard-components)/rating";
import { Welcome } from "./(dashboard-components)/welcome";

export interface DashboardPageRootProps {}

export default function DashboardPageRoot(_props: DashboardPageRootProps) {
  return (
    <div className="flex flex-col md:grid grid-cols-[minmax(0,1fr),300px] gap-10 items-start">
      <div className="flex flex-col gap-10 w-full">
        <Welcome />
        <Banner />
        <CourseResume />
        <CourseSuggestion />
        <Rating />
        <FAQ />
      </div>
      <Partner />
    </div>
  );
}
