import PageNotFound from "@/app/not-found";
import UserUpdateCourse from "@/components/user/UserUpdateCourse";
import { getAllCoursesUser } from "@/modules/course/actions";
import { getUserByUsername } from "@/modules/user/actions";
import { LEARNABLE_COURSE_STATUSES } from "@/shared/constants/course.constants";
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

  // Gồm cả khóa đã ngừng bán: admin vẫn cần thêm tay cho trường hợp ngoại lệ
  const courses = await getAllCoursesUser({
    statuses: LEARNABLE_COURSE_STATUSES,
  });

  return (
    <UserUpdateCourse
      user={parseData(user) || {}}
      courses={parseData(courses) || []}
    />
  );
};

export default AddCourseForUserPage;
