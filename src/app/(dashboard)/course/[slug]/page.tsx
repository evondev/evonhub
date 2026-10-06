import { fetchCourseBySlug } from "@/modules/course/actions";
import { CourseDetailsPage } from "@/modules/course/pages/course-details-page";
import { htmlToPlainText } from "@/shared/helpers/html.helper";
import { Metadata } from "next";

interface CourseDetailsPageRootProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CourseDetailsPageRootProps): Promise<Metadata> {
  // fetchCourseBySlug đọc qua cache(): page bên dưới dùng lại kết quả, không query lần hai
  const courseDetails = await fetchCourseBySlug(params.slug);
  const description = htmlToPlainText(courseDetails?.desc || "");

  return {
    title: courseDetails?.title,
    description,
    keywords: courseDetails?.seoKeywords,
    openGraph: {
      title: courseDetails?.title,
      description,
      images: [courseDetails?.image || "/cover.jpg"],
    },
  };
}

export default function CourseDetailsPageRoot({
  params,
}: CourseDetailsPageRootProps) {
  return <CourseDetailsPage slug={params.slug} />;
}
