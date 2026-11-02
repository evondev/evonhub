import { Button } from "@/components/ui/button";
import { ToneBadge, UserAvatar } from "@/shared/components/common";
import { ActivityType } from "@/shared/constants/activity.constants";
import { timeAgo } from "@/shared/utils";
import Link from "next/link";
import { ACTIVITY_TYPE_CONFIGS } from "../../../constants/activity-type.constants";
import { ActivityRow } from "../../../types";
import {
  formatActivityDuration,
  formatActivityTime,
  isActivityOnline,
} from "../../../utils";
import { ActivityActionLine } from "./activity-action-line";

interface ActivityListItemProps {
  activity: ActivityRow;
  /** Bấm tên người: lọc nhật ký theo người đó */
  onSelectUser: (email: string) => void;
}

const userButtonClassName =
  "-my-0.5 h-auto min-h-0 truncate p-0 py-0.5 text-sm font-medium text-foreground underline-offset-4 hover:bg-transparent hover:text-foreground hover:underline";

/** Ai · làm gì ở đâu · thuộc khoá nào · chi tiết · bao lâu trước */
export function ActivityListItem({
  activity,
  onSelectUser,
}: ActivityListItemProps) {
  const { target } = ACTIVITY_TYPE_CONFIGS[activity.type];
  const isOnline = isActivityOnline(activity);
  const isViewLesson = activity.type === ActivityType.ViewLesson;
  // Việc nhắm vào bài hay chương thì ghi khoá ở dòng dưới; nhắm vào khoá thì tên khoá đã ở trên
  const hasCourseContext = target === "lesson" || target === "lecture";

  return (
    <li className="flex gap-3 border-b border-border px-4 py-3 last:border-0 sm:px-5">
      <UserAvatar
        name={activity.userName}
        avatar={activity.userAvatar}
        className="size-9"
      />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          {activity.userEmail && (
            <Button
              variant="ghost"
              title={`Xem mọi hoạt động của ${activity.userName}`}
              onClick={() => onSelectUser(activity.userEmail)}
              className={userButtonClassName}
            >
              {activity.userName}
            </Button>
          )}
          {!activity.userEmail && (
            <span className="truncate text-sm font-medium text-muted">
              {activity.userName}
            </span>
          )}
          {activity.userRoleLabel && (
            <ToneBadge
              tone="neutral"
              label={activity.userRoleLabel}
              className="shrink-0 py-0.5"
            />
          )}
          {isOnline && (
            <ToneBadge
              tone="success"
              label="Đang học"
              className="shrink-0 py-0.5"
            />
          )}
        </div>
        <ActivityActionLine activity={activity} />
        {hasCourseContext && (
          <p className="mt-0.5 truncate text-xs text-muted">
            {activity.courseHref && (
              <Link
                href={activity.courseHref}
                title={activity.courseTitle}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {activity.courseTitle}
              </Link>
            )}
            {!activity.courseHref && activity.courseTitle}
            {isViewLesson && <> · {formatActivityDuration(activity)}</>}
          </p>
        )}
        {activity.detail && (
          <p
            title={activity.detail}
            className="mt-1 line-clamp-2 text-xs text-pretty text-muted"
          >
            {activity.detail}
          </p>
        )}
      </div>
      <time
        dateTime={activity.lastSeenAt}
        title={formatActivityTime(activity.lastSeenAt)}
        className="shrink-0 pt-0.5 text-xs tabular-nums text-muted"
      >
        {timeAgo(activity.lastSeenAt)}
      </time>
    </li>
  );
}
