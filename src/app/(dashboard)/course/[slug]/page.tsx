import { fetchCourseBySlug } from "@/modules/course/actions";
import { CourseDetailsPage } from "@/modules/course/pages";
import { Metadata, ResolvingMetadata } from "next";

export interface CourseDetailsPageRootProps {}
interface Props {
  params: {
    slug: string;
  };
}
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  const courseDetails = await fetchCourseBySlug(slug);

  return {
    title: courseDetails?.title,
    description: courseDetails?.desc,
    keywords: courseDetails?.seoKeywords,
    openGraph: {
      title: courseDetails?.title,
      description: courseDetails?.desc,
      images: [courseDetails?.image || "/cover.jpg"],
    },
  };
}

export default function CourseDetailsPageRoot(
  _props: CourseDetailsPageRootProps
) {
  return <CourseDetailsPage />;
}
