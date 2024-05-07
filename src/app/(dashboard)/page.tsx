import { getLessonByCourseId } from "@/lib/actions/lesson.action";
import { getUserById } from "@/lib/actions/user.action";
import Dashboard from "@/pages/Dashboard";
import { auth } from "@clerk/nextjs/server";

async function Home() {
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  if (!mongoUser) return null;
  const courses = JSON.parse(JSON.stringify(mongoUser.courses));
  const allPromise = Promise.all(
    courses.map(async (item: any) => {
      return getLessonByCourseId(item._id);
    })
  );
  const lessons = await allPromise;

  return (
    <Dashboard
      lessons={JSON.parse(JSON.stringify(lessons[0]))}
      courses={courses}
    ></Dashboard>
  );
}
export default Home;
