import { cn } from "@/shared/utils";
import { GripVertical } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";
import type { ContentLesson } from "../types";
import { getLessonIssues } from "../utils";

export interface OutlineLessonRowProps {
  lesson: ContentLesson;
  index: number;
  isActive: boolean;
  onSelect: (lessonId: string) => void;
}

interface LessonMetaPart {
  key: string;
  label: string;
  tone: "muted" | "primary" | "warning";
}

function getLessonMetaParts(lesson: ContentLesson): LessonMetaPart[] {
  const { isMissingVideo, isMissingContent } = getLessonIssues(lesson);
  const parts: LessonMetaPart[] = [];

  if (lesson.duration > 0) {
    parts.push({
      key: "duration",
      label: `${lesson.duration} phút`,
      tone: "muted",
    });
  }
  if (lesson.trial) {
    parts.push({ key: "trial", label: "Học thử", tone: "primary" });
  }
  if (isMissingVideo) {
    parts.push({ key: "video", label: "Chưa có video", tone: "warning" });
  }
  if (isMissingContent) {
    parts.push({ key: "content", label: "Chưa có nội dung", tone: "warning" });
  }

  return parts;
}

function getRowClassName(isActive: boolean, isDragging: boolean) {
  return cn(
    "flex items-start gap-1 rounded-xl py-2 pl-1 pr-2 transition-colors",
    isDragging && "bg-surface shadow-lg ring-1 ring-border-strong",
    !isDragging && isActive && "bg-item-active",
    !isDragging && !isActive && "hover:bg-item-hover",
  );
}

function getMetaClassName(tone: LessonMetaPart["tone"], isActive: boolean) {
  return cn(
    // Trên nền dòng đang chọn (đậm hơn nền trang), text-muted chỉ còn 4.1:1
    tone === "muted" && isActive && "text-foreground/70",
    tone === "muted" && !isActive && "text-muted",
    tone === "primary" && "font-medium text-primary-strong",
    tone === "warning" && "font-medium text-amber-700 dark:text-amber-400",
  );
}

export function OutlineLessonRow({
  lesson,
  index,
  isActive,
  onSelect,
}: OutlineLessonRowProps) {
  const metaParts = getLessonMetaParts(lesson);

  return (
    <Draggable draggableId={lesson._id} index={index}>
      {(provided, snapshot) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          data-lesson-row-id={lesson._id}
          className="group/row"
        >
          <div className={getRowClassName(isActive, snapshot.isDragging)}>
            {/* Tay nắm chỉ hiện khi rê hoặc Tab tới dòng: 20 dòng 20 tay nắm thì nhiễu hơn tên bài */}
            <span
              {...provided.dragHandleProps}
              aria-label={`Kéo để đổi thứ tự: ${lesson.title}`}
              className={cn(
                "grid size-6 shrink-0 cursor-grab place-items-center rounded-lg text-muted outline-none transition-opacity",
                "opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100",
                snapshot.isDragging && "opacity-100",
              )}
            >
              <GripVertical className="size-4" aria-hidden />
            </span>
            <button
              type="button"
              onClick={() => onSelect(lesson._id)}
              aria-current={isActive ? "true" : undefined}
              className="min-w-0 flex-1 cursor-pointer py-0.5 text-left outline-none"
            >
              <span
                className={cn(
                  "line-clamp-2 text-pretty text-sm",
                  isActive && "font-medium text-foreground",
                  !isActive && "text-foreground/80",
                )}
              >
                {lesson.title}
              </span>
              {metaParts.length > 0 && (
                <span className="mt-0.5 flex flex-wrap gap-x-1.5 text-xs tabular-nums">
                  {metaParts.map((part, partIndex) => (
                    <span key={part.key} className="flex gap-x-1.5">
                      {partIndex > 0 && (
                        <span
                          aria-hidden
                          className={cn(
                            isActive && "text-foreground/70",
                            !isActive && "text-muted",
                          )}
                        >
                          ·
                        </span>
                      )}
                      <span className={getMetaClassName(part.tone, isActive)}>
                        {part.label}
                      </span>
                    </span>
                  ))}
                </span>
              )}
            </button>
          </div>
        </li>
      )}
    </Draggable>
  );
}
