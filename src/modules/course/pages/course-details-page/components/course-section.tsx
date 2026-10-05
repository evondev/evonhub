export interface CourseSectionProps {
  children: React.ReactNode;
  title: string;
  id?: string;
  /** Dòng phụ dưới tiêu đề, ví dụ "3 chương · 55 bài" */
  description?: string;
  /** Nút hoặc số liệu căn phải, cùng hàng tiêu đề */
  action?: React.ReactNode;
}

export default function CourseSection({
  title,
  id,
  description,
  action,
  children,
}: CourseSectionProps) {
  return (
    // scroll-mt: chừa header nổi khi nhảy tới khối bằng nút "Học thử"
    <section id={id} className="scroll-mt-24">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm tabular-nums text-muted">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
