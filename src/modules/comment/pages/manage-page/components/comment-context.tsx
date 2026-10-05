import { ArrowUpRight, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { CommentManageRow } from "../../../types/comment-manage.types";
import { buildCommentLessonHref } from "../../../utils/comment-manage.utils";

interface CommentContextProps {
  comment: CommentManageRow;
}

/**
 * Bình luận nằm ở đâu: đang trả lời ai, bài nào (mở trong tab mới, cuộn tới
 * đúng bình luận), khoá nào. Màn hẹp mỗi nhóm một dòng, dấu · không rớt đầu dòng
 */
export function CommentContext({ comment }: CommentContextProps) {
  return (
    <p className="mt-2 text-pretty text-xs/5 text-muted">
      {comment.replyToName && (
        <>
          <span className="flex items-center gap-1 sm:inline-flex sm:align-top">
            <CornerDownRight aria-hidden className="size-3.5 shrink-0" />
            <span>
              Trả lời{" "}
              <span className="font-medium text-foreground/80">
                {comment.replyToName}
              </span>
            </span>
            {/* Dấu · nằm trong cụm "Trả lời": đứng ngoài thì nó rớt xuống đầu dòng sau */}
            <span aria-hidden className="hidden sm:inline">
              ·
            </span>
          </span>{" "}
        </>
      )}
      <span className="block sm:inline">
        <Link
          href={buildCommentLessonHref(comment)}
          target="_blank"
          title="Mở bình luận trong bài học"
          className="font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
        >
          {comment.lesson.title}
          {/* Icon và dấu · không tách nhau: dấu không rớt xuống đầu dòng. Dấu là
              inline-block nên không mang gạch chân của link */}
          <span className="whitespace-nowrap">
            <ArrowUpRight
              aria-hidden
              className="ml-0.5 inline size-3.5 align-[-2px]"
            />
            {comment.course.title && (
              <span
                aria-hidden
                className="hidden font-normal text-muted sm:inline-block"
              >
                {"\u00a0·"}
              </span>
            )}
          </span>
        </Link>
      </span>{" "}
      {comment.course.title && (
        <span className="block sm:inline">{comment.course.title}</span>
      )}
    </p>
  );
}
