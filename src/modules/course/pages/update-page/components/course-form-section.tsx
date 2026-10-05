import { cn } from "@/shared/utils";

export interface CourseFormSectionProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function CourseFormSection({
  title,
  description,
  action,
  className,
  children,
}: CourseFormSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 sm:p-5",
        className,
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        {/* min-h-10 chỉ khi có nút: tiêu đề một dòng nằm giữa nút */}
        <div className={cn("min-w-0", action && "flex min-h-10 flex-col justify-center")}>
          <h2 className="text-balance text-base font-semibold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-pretty text-sm text-muted">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </header>

      {children}
    </section>
  );
}
