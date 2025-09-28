"use client";

import { Heading } from "@/shared/components";
import { CourseItemResume } from "@/shared/components/course";
import { CourseResumeList } from "@/shared/components/course/course-resume-list";
import { CourseItemData } from "../../types";

export interface StudyPageContainerProps {
  courses?: CourseItemData[];
  lessons?: { _id: string; slug: string }[];
  isLoading?: boolean;
}

export function StudyPageContainer({
  courses = [],
  lessons = [],
  isLoading = false,
}: StudyPageContainerProps) {
  return (
    <div className="flex flex-col gap-8">
      <Heading>Khu vực học tập</Heading>
      <CourseResumeList isLoading={isLoading}>
        {courses.map((course, index) => (
          <CourseItemResume
            key={course.slug}
            slug={course.slug}
            image={course.image}
            title={course.title}
            courseId={course._id}
            lesson={lessons[index]}
          ></CourseItemResume>
        ))}
      </CourseResumeList>
    </div>
  );
}
