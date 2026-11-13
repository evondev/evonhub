import { InterviewCourseSummary } from "../types";

interface InterviewCourseMetaProps {
  course: InterviewCourseSummary;
}

/** Dòng tiến độ dưới tên khoá: số câu đã làm, số câu sai, điểm */
export function InterviewCourseMeta({ course }: InterviewCourseMetaProps) {
  const { answeredCount, totalQuestions, wrongCount, points } = course;

  if (!answeredCount) {
    return (
      <p className="min-w-0 truncate text-muted">
        Chưa bắt đầu · {totalQuestions} câu
      </p>
    );
  }

  return (
    <p className="min-w-0 truncate text-muted">
      {answeredCount}/{totalQuestions} câu
      {wrongCount > 0 && (
        <>
          {" · "}
          <span className="text-red-700 dark:text-red-400">
            {wrongCount} câu sai
          </span>
        </>
      )}
      {" · "}
      {points} điểm
    </p>
  );
}
