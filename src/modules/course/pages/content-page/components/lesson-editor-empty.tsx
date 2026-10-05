export interface LessonEditorEmptyProps {
  hasLectures: boolean;
}

// Một câu chữ mờ ở chỗ đáng lẽ có form, nói việc cần làm tiếp ở cột trái
export function LessonEditorEmpty({ hasLectures }: LessonEditorEmptyProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-10">
      <p className="text-pretty text-center text-sm text-muted">
        {hasLectures &&
          "Chưa có bài học nào. Bấm Thêm bài học trong một chương ở cột bên trái."}
        {!hasLectures &&
          "Khóa học chưa có nội dung. Bấm Thêm chương ở cột bên trái để bắt đầu."}
      </p>
    </div>
  );
}
