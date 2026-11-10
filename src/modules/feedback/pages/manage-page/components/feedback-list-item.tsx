import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/shared/components/common";
import { formatFullDateTime, timeAgo } from "@/shared/utils";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { FeedbackRow } from "../../../types";
import { FeedbackAnswer } from "./feedback-answer";

interface FeedbackListItemProps {
  feedback: FeedbackRow;
  onDelete: (feedback: FeedbackRow) => void;
}

/** Ai gửi · bao lâu trước · khoá học, tiếng Anh giao tiếp, tính năng muốn có */
export function FeedbackListItem({
  feedback,
  onDelete,
}: FeedbackListItemProps) {
  const avatar = (
    <UserAvatar
      name={feedback.userName}
      avatar={feedback.userAvatar}
      className="size-9"
    />
  );

  return (
    <li className="flex gap-3 border-b border-border px-4 py-4 last:border-0 sm:px-5">
      {feedback.userProfileHref && (
        <Link
          href={feedback.userProfileHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Xem trang cá nhân của ${feedback.userName}`}
          className="h-fit shrink-0 rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          {avatar}
        </Link>
      )}
      {!feedback.userProfileHref && <div className="shrink-0">{avatar}</div>}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
            {feedback.userName}
          </p>
          <time
            dateTime={feedback.createdAt}
            title={formatFullDateTime(feedback.createdAt)}
            className="shrink-0 text-xs tabular-nums text-muted"
          >
            {timeAgo(feedback.createdAt)}
          </time>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Xoá góp ý của ${feedback.userName}`}
            title="Xoá góp ý"
            onClick={() => onDelete(feedback)}
            className="-my-2 -mr-2 size-8 shrink-0 rounded-lg hover:text-rose-600"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <div className="mt-2 flex flex-col gap-3">
          {feedback.courseWish && (
            <FeedbackAnswer
              label="Khoá học muốn có"
              content={feedback.courseWish}
            />
          )}
          {feedback.englishAnswer && (
            <FeedbackAnswer
              label="Tiếng Anh giao tiếp"
              content={feedback.englishAnswer}
            />
          )}
          {feedback.featureWish && (
            <FeedbackAnswer
              label="Tính năng muốn có"
              content={feedback.featureWish}
            />
          )}
        </div>
      </div>
    </li>
  );
}
