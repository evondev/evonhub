import PageNotFound from "@/app/not-found";
import { getCourseUpdateOutline } from "@/lib/actions/admin.action";
import {
  CourseContentPage,
  type CourseContentData,
} from "@/modules/course/pages/content-page";

interface CourseContentRouteProps {
  searchParams: {
    slug: string;
  };
}

export default async function CourseContentRoute({
  searchParams,
}: CourseContentRouteProps) {
  const findCourse = await getCourseUpdateOutline(searchParams.slug);
  if (!findCourse?.slug) return <PageNotFound />;

  const data: CourseContentData = JSON.parse(JSON.stringify(findCourse));

  return <CourseContentPage data={data} />;
}
