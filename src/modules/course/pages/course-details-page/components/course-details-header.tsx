import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CourseMetaRow, { CourseMetaRowProps } from "./course-meta-row";

export interface CourseDetailsHeaderProps extends CourseMetaRowProps {
  title: string;
}

export default function CourseDetailsHeader({
  title,
  ...metaRowProps
}: CourseDetailsHeaderProps) {
  return (
    <header className="min-w-0">
      {/* Đường dẫn chỉ ghi cấp cha; tên khóa nằm ngay dưới */}
      <nav aria-label="Đường dẫn" className="flex h-8 items-center">
        <Link
          href="/explore"
          className="inline-flex h-8 items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          Danh sách khóa học
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      </nav>
      <h1 className="font-display text-xl font-semibold text-balance text-foreground sm:text-2xl">
        {title}
      </h1>
      <div className="mt-3">
        <CourseMetaRow {...metaRowProps} />
      </div>
    </header>
  );
}
