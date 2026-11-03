import { CourseManagePage } from "@/modules/course/pages";
import { getCurrentAdmin } from "@/shared/libs/auth";

export interface CourseManagePageRootProps {}

export default async function CourseManagePageRoot(
  _props: CourseManagePageRootProps
) {
  const currentAdmin = await getCurrentAdmin();

  return <CourseManagePage canAddVideo={Boolean(currentAdmin)} />;
}
