import { LoadErrorState } from "@/shared/components/common";
import { fetchMyInterviewCourses } from "../../actions";
import {
  InterviewCourseList,
  InterviewCoursesEmpty,
} from "../../components";

export async function InterviewCoursesPage() {
  const courses = await fetchMyInterviewCourses();

  if (!courses) {
    return <LoadErrorState title="Không tải được danh sách khóa" className="max-w-3xl" />;
  }

  if (!courses.length) return <InterviewCoursesEmpty />;

  return <InterviewCourseList courses={courses} />;
}
