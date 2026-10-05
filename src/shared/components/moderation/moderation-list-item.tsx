import { Checkbox } from "@/components/ui/checkbox";
import { CHECKBOX_HIT_AREA_CLASS_NAME } from "@/shared/constants/moderation.constants";
import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { ModerationAction } from "@/shared/types";
import {
  cn,
  formatFullDateTime,
  formatModerationAge,
  isStalePending,
} from "@/shared/utils";
import { ExpandableText } from "./expandable-text";
import { ModerationActions } from "./moderation-actions";

interface ModerationListItemProps {
  authorName: string;
  authorAvatar?: string;
  createdAt: Date | string;
  /** Đang chờ duyệt: chờ quá lâu thì thời gian tô hổ phách */
  isPending: boolean;
  content: string;
  /** Chữ thay nội dung khi mục không có nội dung */
  emptyContentLabel?: string;
  /** Thêm vào hàng tên, sau thời gian: badge trạng thái… */
  meta?: React.ReactNode;
  /**
   * Dòng ngay dưới tên, như trang đánh giá thường làm (mức sao · thời gian).
   * Có dòng này thì thời gian chuyển xuống đây, hàng tên không bị chật
   */
  subline?: React.ReactNode;
  /** Dòng dưới nội dung: mục này nằm ở đâu */
  context: React.ReactNode;
  isSelected: boolean;
  canApprove: boolean;
  canReject: boolean;
  runningAction?: ModerationAction;
  isDisabled: boolean;
  onToggleSelect: () => void;
  onApprove: () => void;
  onReject: () => void;
}

/**
 * Một mục chờ duyệt: người viết và lúc gửi, nội dung đầy đủ, nằm ở đâu.
 * Từ sm nút duyệt nằm bên phải; dưới sm nút xuống dưới, thẳng mép chữ
 */
export function ModerationListItem({
  authorName,
  authorAvatar,
  createdAt,
  isPending,
  content,
  emptyContentLabel,
  meta,
  subline,
  context,
  isSelected,
  canApprove,
  canReject,
  runningAction,
  isDisabled,
  onToggleSelect,
  onApprove,
  onReject,
}: ModerationListItemProps) {
  const isStale = isPending && isStalePending(createdAt);
  const hasContent = Boolean(content.trim());
  const timeLabel = (
    <time
      dateTime={new Date(createdAt).toISOString()}
      title={formatFullDateTime(createdAt)}
      className={cn(
        "shrink-0 text-xs tabular-nums",
        isStale && "font-medium text-amber-700 dark:text-orange-400",
        !isStale && "text-muted",
      )}
    >
      {formatModerationAge(createdAt, isStale)}
    </time>
  );
  const actionProps = {
    canApprove,
    canReject,
    runningAction,
    isDisabled,
    onApprove,
    onReject,
  };

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
          onCheckedChange={onToggleSelect}
          aria-label={`Chọn mục của ${authorName}`}
        />
      </div>
      <CommentAvatar
        name={authorName}
        avatar={authorAvatar}
        className="size-9 ring-1 ring-border-strong"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span
            title={authorName}
            className="min-w-0 truncate text-sm font-medium text-foreground"
          >
            {authorName}
          </span>
          {!subline && timeLabel}
          {meta}
        </div>
        {subline && (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {subline}
            <span aria-hidden className="text-xs text-muted">
              ·
            </span>
            {timeLabel}
          </div>
        )}
        {hasContent && <ExpandableText text={content} className="mt-1" />}
        {!hasContent && (
          <p className="mt-1 text-pretty text-sm/6 text-muted">
            {emptyContentLabel}
          </p>
        )}
        {context}
        <ModerationActions {...actionProps} className="mt-3 flex sm:hidden" />
      </div>
      <ModerationActions
        {...actionProps}
        // mt-0.5: nút 32px thẳng tâm avatar và ô chọn (36px)
        className="mt-0.5 hidden shrink-0 self-start sm:flex"
      />
    </li>
  );
}
