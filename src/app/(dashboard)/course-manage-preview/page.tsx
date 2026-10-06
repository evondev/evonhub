import { COURSE_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/course/constants/course-manage.constants";
import { CourseManagePreviewPage } from "@/modules/course/pages";
import { CourseManagePreviewState } from "@/modules/course/types/course-manage.types";
import { notFound } from "next/navigation";

interface CourseManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function CourseManagePreviewRoute({
  searchParams,
}: CourseManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = COURSE_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: CourseManagePreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return <CourseManagePreviewPage key={state} state={state} />;
}
