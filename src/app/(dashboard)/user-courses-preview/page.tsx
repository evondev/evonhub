import { COURSE_ACCESS_PREVIEW_STATE_LINKS } from "@/modules/user/constants/course-access.constants";
import { UserCourseAccessPreviewPage } from "@/modules/user/pages";
import { CourseAccessPreviewState } from "@/modules/user/types/course-access.types";
import { notFound } from "next/navigation";

interface UserCoursesPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function UserCoursesPreviewRoute({
  searchParams,
}: UserCoursesPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = COURSE_ACCESS_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: CourseAccessPreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái là dựng lại từ đầu, danh sách khóa và hộp mở sẵn theo trạng thái mới
  return <UserCourseAccessPreviewPage key={state} state={state} />;
}
