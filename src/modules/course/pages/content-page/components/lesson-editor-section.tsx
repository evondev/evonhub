export interface LessonEditorSectionProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}

// Cùng khuôn với các khối của trang sửa khóa học: card trắng, tiêu đề base, mô tả xám
export function LessonEditorSection({
  title,
  description,
  children,
}: LessonEditorSectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <header className="mb-4 min-w-0">
        <h3 className="text-balance text-base font-semibold text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-1 max-w-[55ch] text-pretty text-sm text-muted">
            {description}
          </p>
        )}
      </header>

      {children}
    </section>
  );
}
