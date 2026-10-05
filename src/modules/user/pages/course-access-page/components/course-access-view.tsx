"use client";

import { useEffect, useState } from "react";
import {
  CourseAccessCourse,
  CourseAccessGrant,
  CourseAccessInitialDialog,
  CourseAccessUser,
} from "../../../types/course-access.types";
import { CourseAccessHeader } from "./course-access-header";
import { GrantCourseDialog } from "./grant-course-dialog";
import { OwnedCourseSection } from "./owned-course-section";
import { RevokeCourseDialog } from "./revoke-course-dialog";

interface CourseAccessViewProps {
  user: CourseAccessUser;
  /** Danh mục khóa cấp được: đang bán và đã ngừng bán */
  courses: CourseAccessCourse[];
  grants: CourseAccessGrant[];
  /** Trả về true khi cấp xong để đóng hộp; lỗi thì hộp giữ nguyên lựa chọn */
  onGrant: (selectedCourses: CourseAccessCourse[]) => Promise<boolean>;
  onRevoke: (grant: CourseAccessGrant) => Promise<boolean>;
  /** Chỉ trang xem trước dùng, để mở sẵn một hộp */
  initialDialog?: CourseAccessInitialDialog;
}

export function CourseAccessView({
  user,
  courses,
  grants,
  onGrant,
  onRevoke,
  initialDialog,
}: CourseAccessViewProps) {
  const [isGrantOpen, setIsGrantOpen] = useState(initialDialog === "grant");
  const [isGranting, setIsGranting] = useState(false);
  const [pendingRevoke, setPendingRevoke] = useState<CourseAccessGrant | null>(
    initialDialog === "revoke" ? grants[0] || null : null,
  );
  const [isRevoking, setIsRevoking] = useState(false);
  // Radix không vẽ hộp ở server: hộp mở sẵn (trang xem trước) chỉ mở sau khi mount, kẻo lệch hydrate
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  const ownedCourseIds = new Set(grants.map((grant) => grant.course.id));

  async function handleGrant(selectedCourses: CourseAccessCourse[]) {
    setIsGranting(true);
    const isGranted = await onGrant(selectedCourses);
    setIsGranting(false);

    if (isGranted) setIsGrantOpen(false);
  }

  async function handleConfirmRevoke() {
    if (!pendingRevoke) return;

    setIsRevoking(true);
    const isRevoked = await onRevoke(pendingRevoke);
    setIsRevoking(false);

    if (isRevoked) setPendingRevoke(null);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 sm:gap-6">
      <CourseAccessHeader user={user} onGrantClick={() => setIsGrantOpen(true)} />
      <OwnedCourseSection grants={grants} onRevokeClick={setPendingRevoke} />

      <GrantCourseDialog
        isOpen={hasMounted && isGrantOpen}
        userName={user.name}
        courses={courses}
        ownedCourseIds={ownedCourseIds}
        isGranting={isGranting}
        onGrant={handleGrant}
        onClose={() => setIsGrantOpen(false)}
      />
      <RevokeCourseDialog
        pendingGrant={hasMounted ? pendingRevoke : null}
        userName={user.name}
        isRevoking={isRevoking}
        onConfirm={handleConfirmRevoke}
        onCancel={() => setPendingRevoke(null)}
      />
    </div>
  );
}
