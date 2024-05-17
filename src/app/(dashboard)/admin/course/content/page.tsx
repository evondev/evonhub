import CourseContent from "@/components/course/CourseContent";
import { getCourseBySlug } from "@/lib/actions/course.action";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { userId } = auth();
  const data = await getCourseBySlug(searchParams.slug, userId || "");
  return (
    <CourseContent data={JSON.parse(JSON.stringify(data))}></CourseContent>
  );
};

export default page;
