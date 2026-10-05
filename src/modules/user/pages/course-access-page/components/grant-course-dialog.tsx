"use client";

import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { CourseAccessCourse } from "../../../types/course-access.types";
import {
  buildGrantSubmitLabel,
  filterCourseOptions,
  quoteSearchQuery,
  sortCourseOptions,
} from "../../../utils/course-access.utils";
import { GrantCourseOption } from "./grant-course-option";
import { GrantCourseSearch } from "./grant-course-search";

interface GrantCourseDialogProps {
  isOpen: boolean;
  userName: string;
  courses: CourseAccessCourse[];
  ownedCourseIds: Set<string>;
  isGranting: boolean;
  onGrant: (selectedCourses: CourseAccessCourse[]) => void;
  onClose: () => void;
}

// Hộp neo đỉnh chứ không căn giữa dọc: gõ tìm làm danh sách ngắn lại, căn giữa
// thì ô tìm nhảy lên xuống theo từng chữ. Căn ngang bằng inset + mx-auto, không
// translate, để chuyển động zoom không kéo hộp lệch sang trái lúc mở.
const dialogContentClassName =
  "fixed inset-x-4 top-4 z-50 mx-auto flex max-h-[calc(100dvh-2rem)] max-w-lg flex-col rounded-2xl border border-border bg-surface shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:duration-100 data-[state=open]:duration-150 data-[state=closed]:ease-in data-[state=open]:ease-out motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[state=open]:zoom-in-100 sm:top-[8vh] sm:max-h-[84vh]";

export function GrantCourseDialog({
  isOpen,
  userName,
  courses,
  ownedCourseIds,
  isGranting,
  onGrant,
  onClose,
}: GrantCourseDialogProps) {
  const [query, setQuery] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const visibleCourses = sortCourseOptions(
    filterCourseOptions(courses, query),
    ownedCourseIds,
  );
  const selectedCount = selectedCourseIds.length;
  const hasQuery = query.trim().length > 0;
  const isCatalogEmpty = courses.length === 0;

  function handleOpenAutoFocus(event: Event) {
    // Dọn lúc mở, không lúc đóng: hộp còn chạy chuyển động đóng thì chữ không nhảy
    event.preventDefault();
    setQuery("");
    setSelectedCourseIds([]);
    searchInputRef.current?.focus();
  }

  function handleOpenChange(isNextOpen: boolean) {
    if (!isNextOpen && !isGranting) onClose();
  }

  function handleToggleCourse(courseId: string) {
    setSelectedCourseIds((currentIds) => {
      if (currentIds.includes(courseId))
        return currentIds.filter((selectedId) => selectedId !== courseId);

      return [...currentIds, courseId];
    });
  }

  function handleClearQuery() {
    setQuery("");
    searchInputRef.current?.focus();
  }

  function handleSubmit() {
    const selectedCourses = courses.filter((course) =>
      selectedCourseIds.includes(course.id),
    );

    onGrant(selectedCourses);
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-100 data-[state=open]:duration-150" />
        <DialogPrimitive.Content
          onOpenAutoFocus={handleOpenAutoFocus}
          // Đang chọn dở thì bấm nhầm ra ngoài không được làm mất lựa chọn
          onInteractOutside={(event) => event.preventDefault()}
          className={dialogContentClassName}
        >
          <div className="relative px-6 pb-4 pt-6">
            <DialogPrimitive.Title className="pr-10 text-lg font-semibold text-foreground">
              Cấp khóa học
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 text-pretty text-sm/6 text-muted">
              Cho <span className="font-medium text-foreground">{userName}</span>
              . Mỗi khóa tạo một đơn đã duyệt và gửi thông báo cho thành viên.
            </DialogPrimitive.Description>
            <div className="mt-4">
              <GrantCourseSearch
                ref={searchInputRef}
                value={query}
                onChange={setQuery}
                onClear={handleClearQuery}
              />
            </div>
            <DialogPrimitive.Close asChild>
              <Button
                type="button"
                variant="ghost"
                aria-label="Đóng"
                disabled={isGranting}
                className="absolute right-4 top-4 size-9 rounded-lg p-0"
              >
                <X className="size-4" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="scrollbar-auto-hide min-h-0 flex-1 overflow-y-auto border-y border-border px-3 py-2">
            {isCatalogEmpty && (
              <p className="py-6 text-center text-sm text-muted">
                Chưa có khóa học nào để cấp.
              </p>
            )}
            {!isCatalogEmpty && visibleCourses.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted">
                Không có khóa học nào khớp{" "}
                <span title={query} className="text-foreground">
                  {quoteSearchQuery(query)}
                </span>
                . Thử từ khoá khác.{" "}
                {hasQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClearQuery}
                    className="inline h-auto min-h-0 rounded-none p-0 align-baseline font-medium text-foreground underline-offset-4 hover:bg-transparent hover:underline"
                  >
                    Xoá tìm kiếm
                  </Button>
                )}
              </p>
            )}
            {visibleCourses.length > 0 && (
              <ul className="flex flex-col gap-0.5">
                {visibleCourses.map((course) => (
                  <GrantCourseOption
                    key={course.id}
                    course={course}
                    isOwned={ownedCourseIds.has(course.id)}
                    isSelected={selectedCourseIds.includes(course.id)}
                    isDisabled={isGranting}
                    onToggle={handleToggleCourse}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-sm tabular-nums text-muted">
              {selectedCount > 0 && `Đã chọn ${selectedCount} khóa`}
              {selectedCount === 0 && "Chưa chọn khóa nào"}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                className="h-11 md:h-10"
                disabled={isGranting}
                onClick={onClose}
              >
                Huỷ
              </Button>
              <Button
                type="button"
                variant="primary"
                className="h-11 md:h-10"
                disabled={selectedCount === 0}
                isLoading={isGranting}
                onClick={handleSubmit}
              >
                {buildGrantSubmitLabel(selectedCount)}
              </Button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
