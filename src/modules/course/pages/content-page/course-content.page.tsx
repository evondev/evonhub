"use client";

import { updateCourseWithLecture } from "@/lib/actions/course.action";
import { deleteLecture, updateLecture } from "@/lib/actions/lecture.action";
import { addLesson, deleteLesson } from "@/lib/actions/lesson.action";
import {
  updateLectureLessonOrder,
  updateLessonOrder,
} from "@/modules/lesson/actions";
import { useMediaQuery } from "@/shared/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import { useLessonSelection } from "./hooks/use-lesson-selection";
import { ContentConfirmDialog } from "./components/content-confirm-dialog";
import { ContentHeader } from "./components/content-header";
import { DesktopOnlyNotice } from "./components/desktop-only-notice";
import { LessonEditor } from "./components/lesson-editor";
import { LessonEditorEmpty } from "./components/lesson-editor-empty";
import { OutlinePanel } from "./components/outline-panel";
import { NEW_LECTURE_TITLE, NEW_LESSON_TITLE } from "./constants";
import type {
  ContentLecture,
  ContentLesson,
  CourseContentData,
  PendingContentAction,
} from "./types";
import {
  buildCourseContentPath,
  getCourseContentStats,
  getLecturesAfterDrag,
} from "./utils";

export interface CourseContentPageProps {
  data: CourseContentData;
}

export function CourseContentPage({ data }: CourseContentPageProps) {
  const router = useRouter();
  // Kéo thả chỉ dựng ở client và từ lg: react-beautiful-dnd không tìm được tay nắm
  // trong khối display:none, và id nó sinh ở server lệch với client
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const contentPath = buildCourseContentPath(data.slug);
  const [lectureList, setLectureList] = useState<ContentLecture[]>(
    data.lecture,
  );
  const [pendingAction, setPendingAction] =
    useState<PendingContentAction | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    selectedLocation,
    openLectureIds,
    setOpenLectureIds,
    setIsEditorDirty,
    requestSelectLesson,
    forceSelectLesson,
    selectWhenAvailable,
  } = useLessonSelection(lectureList, { onRequestDiscard: setPendingAction });
  const [renamingLectureId, setRenamingLectureId] = useState("");
  const [addingLessonLectureId, setAddingLessonLectureId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState({
    lecture: false,
    lectureTitle: false,
  });

  useEffect(() => {
    setLectureList(data.lecture);
  }, [data]);

  async function handleAddLesson(lectureId: string) {
    setAddingLessonLectureId(lectureId);

    try {
      const addedLessonId = await addLesson({
        title: NEW_LESSON_TITLE,
        slug: "tieu-de-bai-hoc-moi" + new Date().getTime().toString().slice(-5),
        content: "",
        video: "",
        type: "video",
        order:
          lectureList.find((lecture) => lecture._id === lectureId)?.lessons
            .length || 0,
        lectureId,
        courseId: data._id.toString(),
      });
      if (addedLessonId) selectWhenAvailable(addedLessonId);
      // addLesson làm mới theo slug của bài chứ không theo trang này, nên tự tải lại
      router.refresh();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm bài học");
      console.log(error);
    } finally {
      setAddingLessonLectureId("");
    }
  }

  function handleRequestDeleteLesson(lesson: ContentLesson) {
    setPendingAction({
      kind: "delete-lesson",
      lessonId: lesson._id,
      lectureId: lesson.lectureId,
      title: lesson.title,
    });
  }

  function handleRequestDeleteLecture(lectureId: string) {
    const lecture = lectureList.find((item) => item._id === lectureId);
    if (!lecture) return;

    setPendingAction({
      kind: "delete-lecture",
      lectureId,
      title: lecture.title,
      lessonCount: lecture.lessons.length,
    });
  }

  async function handleConfirmPendingAction() {
    if (!pendingAction) return;

    if (pendingAction.kind === "discard-changes") {
      forceSelectLesson(pendingAction.nextLessonId);
      setPendingAction(null);
      return;
    }

    setIsConfirming(true);

    try {
      if (pendingAction.kind === "delete-lesson") {
        await deleteLesson({
          lessonId: pendingAction.lessonId,
          lectureId: pendingAction.lectureId,
          path: contentPath,
        });
      }
      if (pendingAction.kind === "delete-lecture") {
        await deleteLecture({
          lectureId: pendingAction.lectureId,
          courseId: data._id,
          path: contentPath,
        });
      }
      setPendingAction(null);
    } catch (error) {
      toast.error("Chưa xoá được, thử lại sau");
      console.log(error);
    } finally {
      setIsConfirming(false);
    }
  }

  async function handleAddLecture() {
    setIsSubmitting((previous) => ({ ...previous, lecture: true }));

    try {
      await updateCourseWithLecture({
        title: NEW_LECTURE_TITLE,
        courseId: data._id.toString(),
        order: lectureList.length,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm chương mới");
      console.log(error);
    } finally {
      setIsSubmitting((previous) => ({ ...previous, lecture: false }));
    }
  }

  async function handleSaveLectureTitle(lectureId: string, title: string) {
    setIsSubmitting((previous) => ({ ...previous, lectureTitle: true }));

    try {
      await updateLecture({ lectureId, path: contentPath, data: { title } });
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting((previous) => ({ ...previous, lectureTitle: false }));
      setRenamingLectureId("");
    }
  }

  async function handleDragEnd({ source, destination }: DropResult) {
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const outcome = getLecturesAfterDrag(lectureList, source, destination);
    // Đổi ngay trên màn rồi mới lưu: không thì bài nhảy về chỗ cũ tới khi trang tải lại
    setLectureList(outcome.lectures);

    if (outcome.isSameLecture) {
      await updateLessonOrder({
        lessons: outcome.destinationLessons,
        path: contentPath,
      });
      return;
    }

    await updateLectureLessonOrder({
      lectures: outcome.lectures,
      path: contentPath,
    });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <ContentHeader
        title={data.title}
        stats={getCourseContentStats(lectureList)}
      />

      {!isDesktop && <DesktopOnlyNotice />}

      {isDesktop && (
        <div className="grid grid-cols-[280px_minmax(0,1fr)] items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <OutlinePanel
            lectures={lectureList}
            selectedLessonId={selectedLocation?.lesson._id || ""}
            openLectureIds={openLectureIds}
            renamingLectureId={renamingLectureId}
            isSavingLectureTitle={isSubmitting.lectureTitle}
            addingLessonLectureId={addingLessonLectureId}
            isAddingLecture={isSubmitting.lecture}
            onOpenLectureIdsChange={setOpenLectureIds}
            onSelectLesson={requestSelectLesson}
            onStartRenameLecture={setRenamingLectureId}
            onSaveLectureTitle={handleSaveLectureTitle}
            onCancelRenameLecture={() => setRenamingLectureId("")}
            onDeleteLecture={handleRequestDeleteLecture}
            onAddLesson={handleAddLesson}
            onAddLecture={handleAddLecture}
            onDragEnd={handleDragEnd}
          />

          {selectedLocation && (
            // key: đổi bài thì form dựng lại với giá trị của bài mới
            <LessonEditor
              key={selectedLocation.lesson._id}
              lesson={selectedLocation.lesson}
              lectureTitle={selectedLocation.lecture.title}
              lessonPosition={selectedLocation.lessonIndex + 1}
              lessonCount={selectedLocation.lecture.lessons.length}
              course={{ id: data._id.toString(), slug: data.slug }}
              onDelete={handleRequestDeleteLesson}
              onDirtyChange={setIsEditorDirty}
            />
          )}
          {!selectedLocation && (
            <LessonEditorEmpty hasLectures={lectureList.length > 0} />
          )}
        </div>
      )}

      <ContentConfirmDialog
        pendingAction={pendingAction}
        isConfirming={isConfirming}
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
}
