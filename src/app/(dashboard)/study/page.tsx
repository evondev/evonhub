import Dashboard from "@/components/pages/Dashboard";
import { getUserStudyCourse } from "@/lib/actions/general.action";
import { auth } from "@clerk/nextjs/server";
export const maxDuration = 60;
async function StudyPage() {
  const { userId } = auth();
  if (!userId) return null;
  const data = (await getUserStudyCourse(userId)) || {};
  if (!data || !data.courses || !data.lessons) return null;
  const courseList = JSON.parse(JSON.stringify(data.courses));
  const lessonList = JSON.parse(JSON.stringify(data.lessons));

  return <Dashboard lessons={lessonList} courses={courseList}></Dashboard>;
}
export default StudyPage;
