import { FetchLessonLearnersResult } from "@/modules/activity/types";
import { MenuLinkSignalDot } from "@/shared/components/common/menu-link-signal-dot";
import { UserAvatar } from "@/shared/components/common/user-avatar";

export interface LessonLearnersProps {
  lessonLearners: FetchLessonLearnersResult;
}

// Dòng nhỏ dưới tên bài cho cảm giác có bạn cùng học: vài avatar chồng nhau và
// tổng số người. Không hiện tên ai. Chỉ có mình thì nơi gọi không render.
export function LessonLearners({ lessonLearners }: LessonLearnersProps) {
  const { total, learners } = lessonLearners;

  return (
    <div className="mt-2 flex items-center gap-2">
      <div aria-hidden="true" className="flex -space-x-1.5">
        {learners.map((learner) => (
          <span key={learner.userId} className="rounded-full ring-2 ring-surface">
            <UserAvatar
              name={learner.name}
              avatar={learner.avatar}
              className="size-6 text-[10px]"
            />
          </span>
        ))}
      </div>

      <MenuLinkSignalDot isUnread={false} isPinging />

      <p className="text-xs text-muted">
        {total} người đang học bài này cùng bạn
      </p>
    </div>
  );
}
