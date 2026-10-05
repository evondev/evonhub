import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RatingManageRow } from "../../../types/rating-manage.types";
import { buildRatingCourseHref } from "../../../utils/rating-manage.utils";

interface RatingContextProps {
  rating: RatingManageRow;
}

/** Đánh giá cho khoá nào; bấm mở trang khoá trong tab mới */
export function RatingContext({ rating }: RatingContextProps) {
  return (
    <p className="mt-2 text-pretty text-xs/5 text-muted">
      <Link
        href={buildRatingCourseHref(rating)}
        target="_blank"
        title="Mở trang khoá học"
        className="font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
      >
        {rating.course.title}
        <ArrowUpRight
          aria-hidden
          className="ml-0.5 inline size-3.5 align-[-2px]"
        />
      </Link>
    </p>
  );
}
