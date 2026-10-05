import { Checkbox } from "@/components/ui/checkbox";
import { ToneBadge } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { cn } from "@/shared/utils";
import {
  CHECKBOX_HIT_AREA_CLASS_NAME,
  COMMENT_STATUS_BADGES,
} from "../../../constants/comment-manage.constants";
import {
  CommentManageRow,
  CommentPendingChange,
} from "../../../types/comment-manage.types";
import {
  formatCommentAge,
  formatCommentFullDate,
  isStalePendingComment,
} from "../../../utils/comment-manage.utils";
import { CommentContent } from "./comment-content";
import { CommentContext } from "./comment-context";
import { CommentRowActions } from "./comment-row-actions";

interface CommentListItemProps {
  comment: CommentManageRow;
  isSelected: boolean;
  /** Tab "Tất cả" trộn ba trạng thái nên mỗi dòng có badge */
  isStatusShown: boolean;
  pendingChange: CommentPendingChange | null;
  onToggleSelect: (commentId: string) => void;
  onChangeStatus: (comments: CommentManageRow[], status: CommentStatus) => void;
}

/**
 * Một bình luận: người viết và lúc gửi, nội dung đầy đủ, nằm ở bài nào.
 * Từ sm nút duyệt nằm bên phải; dưới sm nút xuống dưới, thẳng mép chữ
 */
export function CommentListItem({
  comment,
  isSelected,
  isStatusShown,
  pendingChange,
  onToggleSelect,
  onChangeStatus,
}: CommentListItemProps) {
  const isStale = isStalePendingComment(comment);
  const statusBadge = COMMENT_STATUS_BADGES[comment.status];

  return (
    // Đã chọn và đang rê cùng một nền mờ
    <li
      className={cn(
        "flex gap-3 border-b border-border px-4 py-4 transition-colors last:border-0 hover:bg-foreground/[0.025] sm:px-5",
        isSelected && "bg-foreground/[0.025]",
      )}
    >
      {/* h-9: checkbox canh giữa avatar */}
      <div className="flex h-9 shrink-0 items-center">
        <Checkbox
          size="sm"
          className={CHECKBOX_HIT_AREA_CLASS_NAME}
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(comment.id)}
          aria-label={`Chọn bình luận của ${comment.author.name}`}
        />
      </div>
      <CommentAvatar
        name={comment.author.name}
        avatar={comment.author.avatar}
        className="size-9 ring-1 ring-border-strong"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            title={comment.author.name}
            className="min-w-0 truncate text-sm font-medium text-foreground"
          >
            {comment.author.name}
          </span>
          <time
            dateTime={new Date(comment.createdAt).toISOString()}
            title={formatCommentFullDate(comment.createdAt)}
            className={cn(
              "shrink-0 text-xs tabular-nums",
              isStale && "font-medium text-amber-700 dark:text-orange-400",
              !isStale && "text-muted",
            )}
          >
            {formatCommentAge(comment)}
          </time>
          {isStatusShown && (
            <ToneBadge
              tone={statusBadge.tone}
              label={statusBadge.label}
              className="shrink-0 py-0.5"
            />
          )}
        </div>
        <CommentContent content={comment.content} />
        <CommentContext comment={comment} />
        <CommentRowActions
          comment={comment}
          pendingChange={pendingChange}
          onChangeStatus={onChangeStatus}
          className="mt-3 flex sm:hidden"
        />
      </div>
      <CommentRowActions
        comment={comment}
        pendingChange={pendingChange}
        onChangeStatus={onChangeStatus}
        // mt-0.5: nút 32px thẳng tâm avatar và ô chọn (36px)
        className="mt-0.5 hidden shrink-0 self-start sm:flex"
      />
    </li>
  );
}
