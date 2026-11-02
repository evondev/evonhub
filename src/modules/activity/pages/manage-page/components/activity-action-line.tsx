import { cn } from "@/shared/utils";
import Link from "next/link";
import { ACTIVITY_TYPE_CONFIGS } from "../../../constants/activity-type.constants";
import { ActivityRow } from "../../../types";

interface ActivityActionLineProps {
  activity: ActivityRow;
}

const targetClassName = "font-medium";

/** Icon + động từ + tên bài / chương / khoá: "Học bài Bài 1: Giới thiệu" */
export function ActivityActionLine({ activity }: ActivityActionLineProps) {
  const typeConfig = ACTIVITY_TYPE_CONFIGS[activity.type];
  const ActionIcon = typeConfig.icon;
  const isCourseLink = typeConfig.target === "course" && !!activity.courseHref;

  return (
    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-sm text-foreground">
      <ActionIcon
        aria-hidden
        className={cn(
          "size-4 shrink-0",
          typeConfig.tone === "success" && "text-green-500",
          typeConfig.tone === "danger" && "text-red-500",
          typeConfig.tone === "default" && "text-muted",
        )}
      />
      <span className="truncate" title={activity.targetTitle || undefined}>
        {typeConfig.label}
        {activity.targetTitle && " "}
        {isCourseLink && (
          <Link
            href={activity.courseHref}
            className={cn(
              targetClassName,
              "underline-offset-4 hover:underline",
            )}
          >
            {activity.targetTitle}
          </Link>
        )}
        {!isCourseLink && (
          <span className={targetClassName}>{activity.targetTitle}</span>
        )}
      </span>
    </p>
  );
}
