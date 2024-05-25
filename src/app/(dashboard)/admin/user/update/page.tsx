import PageNotFound from "@/app/not-found";
import UserUpdateCourse from "@/components/user/UserUpdateCourse";
import { getAllCourses } from "@/lib/actions/course.action";
import { getUserByUsername } from "@/lib/actions/user.action";
import { ECourseStatus } from "@/types/enums";

const page = async ({
  searchParams,
}: {
  searchParams: {
    username: string;
    email?: string;
  };
}) => {
  const user = await getUserByUsername({
    username: searchParams.username,
    email: searchParams.email,
  });
  const allCoures = await getAllCourses({
    status: ECourseStatus.APPROVED,
  });
  if (!user) return <PageNotFound />;
  return (
    <UserUpdateCourse
      user={JSON.parse(JSON.stringify(user)) || {}}
      courses={JSON.parse(JSON.stringify(allCoures)) || []}
    />
  );
};

export default page;
