import { ToneBadge } from "@/shared/components/common";
import { CourseStatus } from "@/shared/constants/course.constants";
import {
  COURSE_MANAGE_STATUS_LABELS,
  COURSE_MANAGE_STATUS_TONES,
} from "../../../constants/course-manage.constants";

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

export function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  return (
    <ToneBadge
      tone={COURSE_MANAGE_STATUS_TONES[status]}
      label={COURSE_MANAGE_STATUS_LABELS[status]}
      className="py-0.5"
    />
  );
}
