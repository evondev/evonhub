import { Suspense } from "react";
import { CourseDetailsContent } from "./components/course-details-content";
import { CourseDetailsLoading } from "./components/course-details.loading";

export interface CourseDetailsPageProps {
  slug: string;
}

export function CourseDetailsPage({ slug }: CourseDetailsPageProps) {
  return (
    <Suspense fallback={<CourseDetailsLoading />}>
      <CourseDetailsContent slug={slug} />
    </Suspense>
  );
}
