import { Button } from "@/components/ui/button";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import type { ContentLecture } from "../types";
import { OutlineChapter } from "./outline-chapter";

export interface OutlinePanelProps {
  lectures: ContentLecture[];
  selectedLessonId: string;
  openLectureIds: string[];
  renamingLectureId: string;
  isSavingLectureTitle: boolean;
  addingLessonLectureId: string;
  isAddingLecture: boolean;
  onOpenLectureIdsChange: (lectureIds: string[]) => void;
  onSelectLesson: (lessonId: string) => void;
  onStartRenameLecture: (lectureId: string) => void;
  onSaveLectureTitle: (lectureId: string, title: string) => void;
  onCancelRenameLecture: () => void;
  onDeleteLecture: (lectureId: string) => void;
  onAddLesson: (lectureId: string) => void;
  onAddLecture: () => void;
  onDragEnd: (result: DropResult) => void;
}

export function OutlinePanel({
  lectures,
  selectedLessonId,
  openLectureIds,
  renamingLectureId,
  isSavingLectureTitle,
  addingLessonLectureId,
  isAddingLecture,
  onOpenLectureIdsChange,
  onSelectLesson,
  onStartRenameLecture,
  onSaveLectureTitle,
  onCancelRenameLecture,
  onDeleteLecture,
  onAddLesson,
  onAddLecture,
  onDragEnd,
}: OutlinePanelProps) {
  const hasLectures = lectures.length > 0;

  return (
    // Dính dưới header nổi (đáy 80px) như cột phải của trang sửa khóa học; danh sách dài thì cuộn trong cột
    <aside className="sticky top-24 flex max-h-[calc(100vh-112px)] flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="shrink-0 px-5 pb-4 pt-4">
        <h2 className="text-base font-semibold text-foreground">
          Chương và bài học
        </h2>
        {hasLectures && (
          <p className="mt-1 text-pretty text-xs text-muted">
            Kéo tay nắm để đổi thứ tự hoặc chuyển bài sang chương khác.
          </p>
        )}
      </div>

      <div className="scrollbar-auto-hide min-h-0 flex-1 overflow-y-auto border-t border-border">
        {!hasLectures && (
          <p className="px-5 py-6 text-sm text-muted">
            Khóa học chưa có chương nào.
          </p>
        )}

        {hasLectures && (
          <DragDropContext onDragEnd={onDragEnd}>
            <AccordionPrimitive.Root
              type="multiple"
              value={openLectureIds}
              onValueChange={onOpenLectureIdsChange}
              className="divide-y divide-border"
            >
              {lectures.map((lecture) => (
                <OutlineChapter
                  key={lecture._id}
                  lecture={lecture}
                  selectedLessonId={selectedLessonId}
                  isRenaming={renamingLectureId === lecture._id}
                  isSavingTitle={isSavingLectureTitle}
                  isAddingLesson={addingLessonLectureId === lecture._id}
                  onSelectLesson={onSelectLesson}
                  onStartRename={onStartRenameLecture}
                  onSaveTitle={onSaveLectureTitle}
                  onCancelRename={onCancelRenameLecture}
                  onDelete={onDeleteLecture}
                  onAddLesson={onAddLesson}
                />
              ))}
            </AccordionPrimitive.Root>
          </DragDropContext>
        )}

        <div className="border-t border-border p-2">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full justify-start gap-1 rounded-lg pl-1 pr-2"
            isLoading={isAddingLecture}
            onClick={onAddLecture}
          >
            <span className="grid size-6 place-items-center">
              <Plus className="size-4" aria-hidden />
            </span>
            Thêm chương
          </Button>
        </div>
      </div>
    </aside>
  );
}
