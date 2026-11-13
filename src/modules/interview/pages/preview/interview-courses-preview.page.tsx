import { LoadErrorState, PreviewStateSwitcher } from "@/shared/components/common";
import {
  InterviewCourseList,
  InterviewCoursesEmpty,
  InterviewCoursesSkeleton,
  InterviewPageHead,
} from "../../components";
import {
  PREVIEW_INTERVIEW_COURSES,
  PREVIEW_INTERVIEW_COURSES_STATE_LINKS,
} from "../../constants/interview-preview.constants";

interface InterviewCoursesPreviewPageProps {
  state: string;
}

/** Xem trước trang Luyện phỏng vấn bằng khóa giả. Không đọc hay ghi DB. Route chỉ mở ở dev */
export function InterviewCoursesPreviewPage({ state }: InterviewCoursesPreviewPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher links={PREVIEW_INTERVIEW_COURSES_STATE_LINKS} currentState={state} />
      <div>
        <InterviewPageHead />
        {state === "dang-tai" && <InterviewCoursesSkeleton />}
        {state === "loi" && <LoadErrorState title="Không tải được danh sách khóa" className="max-w-3xl" />}
        {state === "rong" && <InterviewCoursesEmpty />}
        {state === "du-lieu" && <InterviewCourseList courses={PREVIEW_INTERVIEW_COURSES} />}
      </div>
    </div>
  );
}
