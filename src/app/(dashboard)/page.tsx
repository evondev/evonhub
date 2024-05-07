import { getLessonByCourseId } from "@/lib/actions/lesson.action";
import { getUserById } from "@/lib/actions/user.action";
import Dashboard from "@/pages/Dashboard";
import { auth } from "@clerk/nextjs/server";

async function Home() {
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  if (!mongoUser) return null;
  const courses = mongoUser.courses;
  const allPromise = Promise.all(
    courses.map(async (item: any) => {
      return getLessonByCourseId(item._id);
    })
  );
  const lessons = await allPromise;

  return (
    <Dashboard
      lessons={lessons[0]}
      courses={JSON.parse(JSON.stringify(courses))}
    ></Dashboard>
  );
}
export default Home;
