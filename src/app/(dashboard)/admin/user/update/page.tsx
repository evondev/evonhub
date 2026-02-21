import PageNotFound from "@/app/not-found";
import UserUpdateCourse from "@/components/user/UserUpdateCourse";
import { getAllCoursesUser } from "@/modules/course/actions";
import { getUserByUsername } from "@/modules/user/actions";
import { CourseStatus } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";

interface AddCourseForUserPageProps {
  searchParams: {
    username: string;
    email?: string;
  };
}

const AddCourseForUserPage = async ({
  searchParams,
}: AddCourseForUserPageProps) => {
  const user = await getUserByUsername({
    username: searchParams.username,
    email: searchParams.email,
  });

  if (!user) return <PageNotFound />;

  const courses = await getAllCoursesUser({
    status: CourseStatus.Approved,
  });

  return (
    <UserUpdateCourse
      user={parseData(user) || {}}
      courses={parseData(courses) || []}
    />
  );
};

export default AddCourseForUserPage;
