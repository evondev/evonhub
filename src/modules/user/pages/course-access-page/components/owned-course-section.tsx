import { CourseAccessGrant } from "../../../types/course-access.types";
import { OwnedCourseRow } from "./owned-course-row";

interface OwnedCourseSectionProps {
  grants: CourseAccessGrant[];
  onRevokeClick: (grant: CourseAccessGrant) => void;
}

export function OwnedCourseSection({
  grants,
  onRevokeClick,
}: OwnedCourseSectionProps) {
  const hasGrants = grants.length > 0;

  return (
    <section
      aria-labelledby="owned-course-title"
      className="rounded-2xl border border-border bg-surface p-2 sm:p-3"
    >
      <div className="flex min-h-11 items-center gap-2 px-2 sm:px-3">
        <h2
          id="owned-course-title"
          className="text-base font-semibold text-foreground"
        >
          Khóa học đang có
        </h2>
        {hasGrants && (
          <span className="text-sm tabular-nums text-muted">
            {grants.length}
          </span>
        )}
      </div>
      {!hasGrants && (
        <p className="py-6 text-center text-sm text-muted">
          Thành viên này chưa có khóa học nào.
        </p>
      )}
      {hasGrants && (
        <ul className="flex flex-col gap-0.5">
          {grants.map((grant) => (
            <OwnedCourseRow
              key={grant.course.id}
              grant={grant}
              onRevokeClick={onRevokeClick}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
