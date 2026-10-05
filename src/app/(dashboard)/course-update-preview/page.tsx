import { PREVIEW_COURSE_UPDATE_DATA } from "@/modules/course/constants";
import { CourseUpdatePage } from "@/modules/course/pages";
import { CourseUpdatePreviewState } from "@/modules/course/types";
import { notFound } from "next/navigation";

interface CourseUpdatePreviewRouteProps {
  searchParams: { tt?: string };
}

// Chỉ chạy ở dev: xem trang cập nhật khóa học với dữ liệu giả, không cần đăng nhập admin
export default function CourseUpdatePreviewRoute({
  searchParams,
}: CourseUpdatePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const state: CourseUpdatePreviewState =
    searchParams.tt === "rong" ? "rong" : "du-lieu";
  const data = PREVIEW_COURSE_UPDATE_DATA[state];

  return <CourseUpdatePage key={state} data={data} slug={data.slug} />;
}
