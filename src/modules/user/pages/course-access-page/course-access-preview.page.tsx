"use client";

import {
  LoadErrorState,
  PreviewStateSwitcher,
} from "@/shared/components/common";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  COURSE_ACCESS_PREVIEW_DELAY_MS,
  COURSE_ACCESS_PREVIEW_STATE_LINKS,
  PREVIEW_COURSE_ACCESS_CATALOG,
  PREVIEW_COURSE_ACCESS_USER,
} from "../../constants/course-access.constants";
import {
  CourseAccessCourse,
  CourseAccessGrant,
  CourseAccessPreviewState,
} from "../../types/course-access.types";
import {
  buildPreviewGrants,
  simulatePreviewDelay,
} from "../../utils/course-access.utils";
import { CourseAccessSkeleton, CourseAccessView } from "./components";

interface UserCourseAccessPreviewPageProps {
  state: CourseAccessPreviewState;
}

/** Trang xem trước "Cấp khóa học thủ công" bằng dữ liệu giả. Không ghi DB, chỉ mở ở dev */
export function UserCourseAccessPreviewPage({
  state,
}: UserCourseAccessPreviewPageProps) {
  const [grants, setGrants] = useState(() => buildPreviewGrants(state));
  const isDataState = state !== "dang-tai" && state !== "loi";

  async function handleGrant(selectedCourses: CourseAccessCourse[]) {
    await simulatePreviewDelay(COURSE_ACCESS_PREVIEW_DELAY_MS);
    const grantedAt = new Date().toISOString();
    const newGrants: CourseAccessGrant[] = selectedCourses.map((course) => ({
      course,
      source: "manual",
      grantedAt,
    }));

    setGrants((currentGrants) => [...newGrants, ...currentGrants]);
    toast.success(`Đã cấp ${selectedCourses.length} khóa học`);

    return true;
  }

  async function handleRevoke(revokedGrant: CourseAccessGrant) {
    await simulatePreviewDelay(COURSE_ACCESS_PREVIEW_DELAY_MS);
    setGrants((currentGrants) =>
      currentGrants.filter(
        (grant) => grant.course.id !== revokedGrant.course.id,
      ),
    );
    toast.success("Đã thu hồi khóa học");

    return true;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={COURSE_ACCESS_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      {state === "dang-tai" && <CourseAccessSkeleton />}
      {state === "loi" && (
        <LoadErrorState title="Chưa tải được khóa học của thành viên" />
      )}
      {isDataState && (
        <CourseAccessView
          user={PREVIEW_COURSE_ACCESS_USER}
          courses={PREVIEW_COURSE_ACCESS_CATALOG}
          grants={grants}
          onGrant={handleGrant}
          onRevoke={handleRevoke}
          initialDialog={
            (state === "hop-cap" && "grant") ||
            (state === "hop-thu-hoi" && "revoke") ||
            undefined
          }
        />
      )}
    </div>
  );
}
