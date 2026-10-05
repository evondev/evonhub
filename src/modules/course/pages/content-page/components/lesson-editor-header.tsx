import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export interface LessonEditorHeaderProps {
  lectureTitle: string;
  lessonPosition: number;
  lessonCount: number;
  previewHref: string;
  isSubmitting: boolean;
}

export function LessonEditorHeader({
  lectureTitle,
  lessonPosition,
  lessonCount,
  previewHref,
  isSubmitting,
}: LessonEditorHeaderProps) {
  return (
    // Dính ngay dưới header nổi (đáy 80px): nút Lưu luôn trong tầm tay khi cuộn xuống ô nội dung.
    // pt-4 phủ khe giữa header và khối này; -mt-4 để lúc chưa dính, đỉnh hàng thẳng đỉnh cột outline.
    <div className="sticky top-20 z-10 -mt-4 bg-background pb-2 pt-4">
      <div className="flex items-center justify-between gap-4">
        {/* Tên bài đã nằm trong ô "Tên bài học" ngay dưới: hàng này chỉ nói bài đang ở đâu */}
        <h2 className="min-w-0 truncate text-sm">
          <span className="font-medium text-foreground">{lectureTitle}</span>
          <span className="text-muted">
            {" "}
            · Bài {lessonPosition}/{lessonCount}
          </span>
        </h2>
        <div className="flex shrink-0 gap-2">
          {/* Nút viền đứng thẳng trên nền trang: nền rê đậm hơn viền (zinc-200), --button-hover tan vào nền */}
          <Button
            asChild
            variant="outline"
            className="hover:bg-zinc-200 dark:hover:bg-white/10"
          >
            <Link href={previewHref} target="_blank">
              <ExternalLink className="size-4 shrink-0" aria-hidden />
              Xem trước
            </Link>
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
