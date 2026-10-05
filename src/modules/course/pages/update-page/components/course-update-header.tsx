import Link from "next/link";

export interface CourseUpdateHeaderProps {
  title: string;
}

export function CourseUpdateHeader({ title }: CourseUpdateHeaderProps) {
  return (
    <header className="min-w-0">
      {/* Chỉ ghi cấp cha, tên khóa học là h1 ngay dưới */}
      <nav aria-label="Đường dẫn">
        <ol className="flex items-center gap-2 text-sm text-muted">
          <li>
            <Link
              href="/admin/course/manage"
              className="inline-flex h-8 items-center transition-colors hover:text-foreground"
            >
              Quản lý khóa học
            </Link>
          </li>
        </ol>
      </nav>
      <h1 className="text-balance text-xl font-semibold text-foreground">
        {title}
      </h1>
    </header>
  );
}
