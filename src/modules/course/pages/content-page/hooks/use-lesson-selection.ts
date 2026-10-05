import { useEffect, useState } from "react";
import type {
  ContentLecture,
  DiscardChangesAction,
  LessonLocation,
} from "../types";
import { findLessonLocation, resolveLessonLocation } from "../utils";

interface UseLessonSelectionOptions {
  /** Form đang có thay đổi chưa lưu mà người dùng chọn bài khác: hỏi trước */
  onRequestDiscard: (action: DiscardChangesAction) => void;
}

interface UseLessonSelectionResult {
  selectedLocation: LessonLocation | null;
  openLectureIds: string[];
  setOpenLectureIds: (lectureIds: string[]) => void;
  setIsEditorDirty: (isDirty: boolean) => void;
  requestSelectLesson: (lessonId: string) => void;
  /** Chọn luôn, bỏ qua thay đổi chưa lưu (sau khi người dùng đã đồng ý bỏ) */
  forceSelectLesson: (lessonId: string) => void;
  /** Chọn bài vừa thêm ngay khi nó có trong danh sách (sau khi trang tải lại) */
  selectWhenAvailable: (lessonId: string) => void;
}

export function useLessonSelection(
  lectureList: ContentLecture[],
  { onRequestDiscard }: UseLessonSelectionOptions,
): UseLessonSelectionResult {
  const [selectedLessonId, setSelectedLessonId] = useState("");
  const selectedLocation = resolveLessonLocation(lectureList, selectedLessonId);
  const [openLectureIds, setOpenLectureIds] = useState<string[]>(
    selectedLocation ? [selectedLocation.lecture._id] : [],
  );
  const [isEditorDirty, setIsEditorDirty] = useState(false);
  const [waitingLessonId, setWaitingLessonId] = useState("");

  function selectLesson(lessonId: string) {
    const location = findLessonLocation(lectureList, lessonId);

    setSelectedLessonId(lessonId);
    if (!location) return;

    setOpenLectureIds((previous) => {
      if (previous.includes(location.lecture._id)) return previous;

      return [...previous, location.lecture._id];
    });
  }

  function requestSelectLesson(lessonId: string) {
    if (lessonId === selectedLocation?.lesson._id) return;

    if (isEditorDirty && selectedLocation) {
      onRequestDiscard({
        kind: "discard-changes",
        nextLessonId: lessonId,
        currentTitle: selectedLocation.lesson.title,
      });
      return;
    }

    selectLesson(lessonId);
  }

  function forceSelectLesson(lessonId: string) {
    setIsEditorDirty(false);
    selectLesson(lessonId);
  }

  useEffect(() => {
    if (!waitingLessonId || !findLessonLocation(lectureList, waitingLessonId)) {
      return;
    }

    setWaitingLessonId("");
    requestSelectLesson(waitingLessonId);
    // Chỉ chạy khi danh sách đổi hoặc có bài chờ chọn: requestSelectLesson dựng lại
    // mỗi render, thêm vào deps sẽ chạy lại liên tục.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lectureList, waitingLessonId]);

  // Bài vừa chọn nằm ngoài khung outline (bài mới ở cuối chương dài) thì cuộn tới.
  // Chờ accordion mở xong chương chứa nó (200ms) rồi mới đo.
  useEffect(() => {
    if (!selectedLessonId) return;
    const timer = setTimeout(() => {
      document
        .querySelector(`[data-lesson-row-id="${selectedLessonId}"]`)
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedLessonId]);

  return {
    selectedLocation,
    openLectureIds,
    setOpenLectureIds,
    setIsEditorDirty,
    requestSelectLesson,
    forceSelectLesson,
    selectWhenAvailable: setWaitingLessonId,
  };
}
