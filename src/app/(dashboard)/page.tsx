import { getUserStudyCourse } from "@/lib/actions/general.action";
import Dashboard from "@/pages/Dashboard";

async function Home() {
  const data = (await getUserStudyCourse()) || [];
  if (!data || !data.courses || !data.lessons) return null;
  const courseList = JSON.parse(JSON.stringify(data.courses));
  const lessonList = JSON.parse(JSON.stringify(data.lessons));

  return <Dashboard lessons={lessonList} courses={courseList}></Dashboard>;
}
export default Home;
