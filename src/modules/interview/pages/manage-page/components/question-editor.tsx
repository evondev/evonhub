"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { INTERVIEW_TAG_LIMIT, INTERVIEW_TEXT_LIMITS } from "../../../constants";
import {
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
} from "../../../constants/interview-enums";
import { InterviewFieldLabel } from "../../../components/interview-field-label";
import { InterviewTagInput } from "../../../components/interview-tag-input";
import { InterviewAdminQuestion, InterviewQuestionFormValues } from "../../../types";
import {
  createEmptyQuestionValues,
  isChoiceQuestionType,
  toQuestionFormValues,
} from "../../../utils";
import { EditorExplanationFields } from "./editor-explanation-fields";
import { EditorFooter } from "./editor-footer";
import { EditorLogItems } from "./editor-log-items";
import { EditorMetaFields } from "./editor-meta-fields";
import { EditorOptions } from "./editor-options";
import { EditorSources } from "./editor-sources";

export interface QuestionEditorProps {
  /** Bỏ trống là soạn câu mới */
  question?: InterviewAdminQuestion;
  courseId: string;
  title: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isSaving: boolean;
  isRegenerating: boolean;
  isUnpublishing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onBack: () => void;
  onSave: (values: InterviewQuestionFormValues, shouldPublish: boolean) => void;
  onDelete: () => void;
  onRegenerate: () => void;
  onUnpublish: () => void;
}

/** Khung soạn một câu. Nạp lại nội dung khi đổi câu (cha đặt key theo id và updatedAt) */
export function QuestionEditor({
  question,
  courseId,
  title,
  canGoPrevious,
  canGoNext,
  isSaving,
  isRegenerating,
  isUnpublishing,
  onPrevious,
  onNext,
  onBack,
  onSave,
  onDelete,
  onRegenerate,
  onUnpublish,
}: QuestionEditorProps) {
  const [values, setValues] = useState<InterviewQuestionFormValues>(() =>
    question ? toQuestionFormValues(question) : createEmptyQuestionValues(courseId),
  );
  const isAiDraft =
    question?.origin === InterviewQuestionOrigin.Ai && question.status === InterviewQuestionStatus.Draft;

  function changeValues(changes: Partial<InterviewQuestionFormValues>) {
    setValues((currentValues) => ({ ...currentValues, ...changes }));
  }

  return (
    <section className="min-w-0 overflow-clip rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-1">
          <Button variant="ghost" size="icon" className="size-9 shrink-0 lg:hidden" aria-label="Về danh sách" onClick={onBack}>
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="icon" className="size-9" aria-label="Câu trước" disabled={!canGoPrevious} onClick={onPrevious}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-9" aria-label="Câu sau" disabled={!canGoNext} onClick={onNext}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        {isAiDraft && (
          <div className="flex items-start gap-3 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary-strong">
            <Sparkles className="mt-0.5 size-4 shrink-0" />
            <p className="text-pretty">
              AI tạo câu này. Học viên chưa thấy cho tới khi bạn bấm Đăng. Đọc kỹ đáp án và đoạn trích trước khi
              đăng.
            </p>
          </div>
        )}
        <EditorMetaFields values={values} onChange={changeValues} />
        {isChoiceQuestionType(values.type) ? (
          <EditorOptions options={values.options} onChange={(options) => changeValues({ options })} />
        ) : (
          <EditorLogItems logItems={values.logItems} onChange={(logItems) => changeValues({ logItems })} />
        )}
        <EditorExplanationFields explanation={values.explanation} keyPoints={values.keyPoints} onChange={changeValues} />
        <EditorSources
          sources={values.sources}
          savedSources={question?.sources || []}
          onChange={(sources) => changeValues({ sources })}
        />
        <div>
          <InterviewFieldLabel htmlFor="interview-tags" hint="Enter để thêm">
            Tag
          </InterviewFieldLabel>
          <InterviewTagInput
            id="interview-tags"
            tags={values.tags}
            maxTags={INTERVIEW_TAG_LIMIT}
            maxLength={INTERVIEW_TEXT_LIMITS.tag}
            placeholder="useState"
            onChange={(tags) => changeValues({ tags })}
          />
        </div>
      </div>
      <EditorFooter
        isNew={!question}
        isPublished={question?.status === InterviewQuestionStatus.Published}
        isSaving={isSaving}
        isRegenerating={isRegenerating}
        isUnpublishing={isUnpublishing}
        onDelete={onDelete}
        onRegenerate={onRegenerate}
        onUnpublish={onUnpublish}
        onSave={(shouldPublish) => onSave(values, shouldPublish)}
      />
    </section>
  );
}
