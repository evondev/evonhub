"use client";
import { CourseList, Heading } from "@/shared/components";
import { CourseStatus } from "@/shared/constants/course.constants";
import { CourseItem } from "../../components";
import { useQueryCourses } from "../../services";

export interface ExplorePageProps {}

export function ExplorePage(_props: ExplorePageProps) {
  const { data: courses, isFetching } = useQueryCourses({
    status: CourseStatus.Approved,
  });

  return (
    <div>
      <Heading>Khám phá</Heading>
      <CourseList isLoading={isFetching}>
        {courses?.map((course) => (
          <CourseItem key={course.slug} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
