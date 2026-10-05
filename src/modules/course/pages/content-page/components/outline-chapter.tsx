import { Button } from "@/components/ui/button";
import {
  formatDurationMinutes,
  sumLessonMinutes,
} from "@/modules/course/utils";
import { cn } from "@/shared/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, Plus } from "lucide-react";
import { Droppable } from "react-beautiful-dnd";
import type { ContentLecture } from "../types";
import { OutlineChapterMenu } from "./outline-chapter-menu";
import { OutlineChapterTitleEdit } from "./outline-chapter-title-edit";
import { OutlineLessonRow } from "./outline-lesson-row";

export interface OutlineChapterProps {
  lecture: ContentLecture;
  selectedLessonId: string;
  isRenaming: boolean;
  isSavingTitle: boolean;
  isAddingLesson: boolean;
  onSelectLesson: (lessonId: string) => void;
  onStartRename: (lectureId: string) => void;
  onSaveTitle: (lectureId: string, title: string) => void;
  onCancelRename: () => void;
  onDelete: (lectureId: string) => void;
  onAddLesson: (lectureId: string) => void;
}

function getChapterMeta(lecture: ContentLecture) {
  const lessonCount = lecture.lessons.length;
  if (lessonCount === 0) return "Chưa có bài";

  return `${lessonCount} bài · ${formatDurationMinutes(sumLessonMinutes(lecture.lessons))}`;
}

export function OutlineChapter({
  lecture,
  selectedLessonId,
  isRenaming,
  isSavingTitle,
  isAddingLesson,
  onSelectLesson,
  onStartRename,
  onSaveTitle,
  onCancelRename,
  onDelete,
  onAddLesson,
}: OutlineChapterProps) {
  const hasLessons = lecture.lessons.length > 0;

  return (
    <AccordionPrimitive.Item value={lecture._id}>
      {isRenaming && (
        <OutlineChapterTitleEdit
          initialTitle={lecture.title}
          isSaving={isSavingTitle}
          onSave={(title) => onSaveTitle(lecture._id, title)}
          onCancel={onCancelRename}
        />
      )}

      {!isRenaming && (
        <AccordionPrimitive.Header className="flex items-start gap-1 pr-3">
          <AccordionPrimitive.Trigger className="group flex min-w-0 flex-1 cursor-pointer items-start gap-2 py-4 pl-4 text-left outline-none">
            <ChevronDown className="mt-0.5 size-4 shrink-0 -rotate-90 text-muted transition-[rotate,color] duration-200 group-hover:text-foreground group-data-[state=open]:rotate-0 motion-reduce:transition-none" />
            <span className="min-w-0 flex-1">
              <span className="block text-pretty text-sm font-medium text-foreground">
                {lecture.title}
              </span>
              <span className="mt-1 block text-xs tabular-nums text-muted">
                {getChapterMeta(lecture)}
              </span>
            </span>
          </AccordionPrimitive.Trigger>
          <div className="pt-3">
            <OutlineChapterMenu
              chapterTitle={lecture.title}
              onRename={() => onStartRename(lecture._id)}
              onDelete={() => onDelete(lecture._id)}
            />
          </div>
        </AccordionPrimitive.Header>
      )}

      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
        <div className="px-2 pb-3">
          <Droppable droppableId={lecture._id}>
            {(provided, snapshot) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  // min-h: chương rỗng vẫn có chỗ để thả bài vào
                  "min-h-10 space-y-0.5 rounded-xl transition-colors",
                  snapshot.isDraggingOver && "bg-background",
                )}
              >
                {lecture.lessons.map((lesson, lessonIndex) => (
                  <OutlineLessonRow
                    key={lesson._id}
                    lesson={lesson}
                    index={lessonIndex}
                    isActive={lesson._id === selectedLessonId}
                    onSelect={onSelectLesson}
                  />
                ))}
                {provided.placeholder}
                {!hasLessons && !snapshot.isDraggingOver && (
                  <li className="flex min-h-10 items-center pl-8 text-sm text-muted">
                    Chương chưa có bài học
                  </li>
                )}
              </ul>
            )}
          </Droppable>

          <Button
            type="button"
            variant="ghost"
            className="mt-0.5 h-9 w-full justify-start gap-1 rounded-lg pl-1 pr-2"
            isLoading={isAddingLesson}
            onClick={() => onAddLesson(lecture._id)}
          >
            <span className="grid size-6 place-items-center">
              <Plus className="size-4" aria-hidden />
            </span>
            Thêm bài học
          </Button>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
