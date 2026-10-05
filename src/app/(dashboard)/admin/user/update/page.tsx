import PageNotFound from "@/app/not-found";
import { getAllCoursesUser } from "@/modules/course/actions";
import { getUserByUsername } from "@/modules/user/actions";
import { UserCourseAccessPage } from "@/modules/user/pages";
import {
  CourseAccessCourseSource,
  CourseAccessUserSource,
} from "@/modules/user/types/course-access.types";
import {
  toCourseAccessCourse,
  toCourseAccessUser,
} from "@/modules/user/utils/course-access.utils";
import { LEARNABLE_COURSE_STATUSES } from "@/shared/constants/course.constants";
import { parseData } from "@/shared/helpers";
import { getCurrentStaff } from "@/shared/libs/auth";

interface AddCourseForUserPageProps {
  searchParams: {
    username: string;
    email?: string;
  };
}

const AddCourseForUserPage = async ({
  searchParams,
}: AddCourseForUserPageProps) => {
  // Expert vào từ trang quản lý đơn để cấp khóa của mình; addCourseToUser kiểm từng khóa
  const currentStaff = await getCurrentStaff();

  if (!currentStaff) return <PageNotFound />;

  const user = await getUserByUsername({
    username: searchParams.username,
    email: searchParams.email,
  });

  if (!user) return <PageNotFound />;

  // Gồm cả khóa đã ngừng bán: admin vẫn cần thêm tay cho trường hợp ngoại lệ
  const courses = await getAllCoursesUser({
    statuses: LEARNABLE_COURSE_STATUSES,
  });
  const userSource: CourseAccessUserSource = parseData(user);
  const courseSources: CourseAccessCourseSource[] = parseData(courses) || [];
  // Ngày cấp và nguồn (đã mua / cấp tay) cần đọc đơn hàng của thành viên, chưa nối
  const grants = (userSource.courses || []).map((course) => ({
    course: toCourseAccessCourse(course),
  }));

  return (
    <UserCourseAccessPage
      user={toCourseAccessUser(userSource)}
      courses={courseSources.map(toCourseAccessCourse)}
      grants={grants}
    />
  );
};

export default AddCourseForUserPage;
