import {
  CourseContentPage,
  PREVIEW_COURSE_CONTENT_DATA,
  type CourseContentPreviewState,
} from "@/modules/course/pages/content-page";
import { notFound } from "next/navigation";

interface CourseContentPreviewRouteProps {
  searchParams: { tt?: string };
}

// Chỉ chạy ở dev: xem trang nội dung khóa học với dữ liệu giả, không cần đăng nhập admin
export default function CourseContentPreviewRoute({
  searchParams,
}: CourseContentPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const state: CourseContentPreviewState =
    searchParams.tt === "rong" ? "rong" : "du-lieu";
  const data = PREVIEW_COURSE_CONTENT_DATA[state];

  return <CourseContentPage key={state} data={data} />;
}
