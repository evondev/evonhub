"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseFilterOption } from "@/shared/types";
import { cn } from "@/shared/utils";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  INTERVIEW_AI_COUNT_OPTIONS,
  INTERVIEW_AI_DEFAULT_COUNT,
  INTERVIEW_AI_PAGE_LIMIT,
  INTERVIEW_AI_TOPIC_SUGGESTIONS,
  INTERVIEW_TEXT_LIMITS,
  INTERVIEW_TYPE_OPTIONS,
} from "../../../constants";
import { InterviewQuestionType } from "../../../constants/interview-enums";
import { InterviewFieldLabel } from "../../../components/interview-field-label";
import { InterviewSegmentedControl } from "../../../components/interview-segmented-control";
import { InterviewTagInput } from "../../../components/interview-tag-input";
import { GenerateInterviewQuestionsInput } from "../../../types";
import { toggleItem } from "../../../utils";

interface AiGenerateDialogProps {
  isOpen: boolean;
  courses: CourseFilterOption[];
  defaultCourseId: string;
  isGenerating: boolean;
  onGenerate: (input: GenerateInterviewQuestionsInput) => void;
  onClose: () => void;
}

const countOptions = INTERVIEW_AI_COUNT_OPTIONS.map((count) => ({ value: String(count), label: String(count) }));

function getToggleChipClassName(isOn: boolean) {
  return cn(
    "h-9 gap-1.5 rounded-lg border px-3 font-normal",
    isOn && "border-primary bg-primary/10 font-medium text-primary-strong hover:bg-primary/10",
    !isOn && "border-border-strong text-foreground/80 hover:bg-button-hover",
  );
}

export function AiGenerateDialog({
  isOpen,
  courses,
  defaultCourseId,
  isGenerating,
  onGenerate,
  onClose,
}: AiGenerateDialogProps) {
  const [form, setForm] = useState<GenerateInterviewQuestionsInput>({
    courseId: defaultCourseId,
    topics: [],
    types: [InterviewQuestionType.Predict, InterviewQuestionType.LogOrder],
    count: INTERVIEW_AI_DEFAULT_COUNT,
    pageUrls: [],
    hint: "",
  });
  const canGenerate = Boolean(form.courseId && form.types.length && form.pageUrls.length);

  function changeForm(changes: Partial<GenerateInterviewQuestionsInput>) {
    setForm((currentForm) => ({ ...currentForm, ...changes }));
  }

  function handleOpenChange(isNextOpen: boolean) {
    if (!isNextOpen && !isGenerating) onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[calc(100dvh-32px)] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border bg-surface p-0 sm:rounded-2xl dark:border-border dark:bg-surface">
        <div className="border-b border-border px-5 py-4 pr-12">
          <DialogTitle className="text-base">Tạo câu hỏi bằng AI</DialogTitle>
          <DialogDescription className="mt-1 text-pretty text-muted dark:text-muted">
            Câu tạo ra nằm ở Chờ duyệt, học viên chưa thấy cho tới khi bạn đăng.
          </DialogDescription>
        </div>
        <div className="scrollbar-auto-hide flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
          <div>
            <InterviewFieldLabel>Khóa</InterviewFieldLabel>
            <Select value={form.courseId} onValueChange={(courseId) => changeForm({ courseId })}>
              <SelectTrigger aria-label="Khóa" className="h-11 rounded-xl border-border-strong bg-surface md:h-10">
                <SelectValue placeholder="Chọn khóa" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <InterviewFieldLabel htmlFor="interview-ai-pages" hint={`tối đa ${INTERVIEW_AI_PAGE_LIMIT}, Enter để thêm`}>
              Trang tài liệu
            </InterviewFieldLabel>
            <InterviewTagInput
              id="interview-ai-pages"
              tags={form.pageUrls}
              maxTags={INTERVIEW_AI_PAGE_LIMIT}
              maxLength={300}
              placeholder="Dán link react.dev, nextjs.org, developer.mozilla.org…"
              onChange={(pageUrls) => changeForm({ pageUrls })}
            />
            <p className="mt-1.5 text-pretty text-xs text-muted">
              AI chỉ ra đề từ các trang này và phải trích nguyên văn đoạn làm căn cứ.
            </p>
          </div>
          <div>
            <InterviewFieldLabel hint="không bắt buộc">Chủ đề</InterviewFieldLabel>
            <div className="flex flex-wrap gap-2">
              {INTERVIEW_AI_TOPIC_SUGGESTIONS.map((topic) => {
                const isOn = form.topics.includes(topic);

                return (
                  <Button key={topic} type="button" aria-pressed={isOn} className={getToggleChipClassName(isOn)} onClick={() => changeForm({ topics: toggleItem(form.topics, topic) })}>
                    {isOn && <Check className="size-3.5" />}
                    {topic}
                  </Button>
                );
              })}
            </div>
          </div>
          <div>
            <InterviewFieldLabel>Dạng bài</InterviewFieldLabel>
            <div className="flex flex-wrap gap-2">
              {INTERVIEW_TYPE_OPTIONS.map((typeOption) => {
                const isOn = form.types.includes(typeOption.value);

                return (
                  <Button key={typeOption.value} type="button" aria-pressed={isOn} className={getToggleChipClassName(isOn)} onClick={() => changeForm({ types: toggleItem(form.types, typeOption.value) })}>
                    {isOn && <Check className="size-3.5" />}
                    {typeOption.label}
                  </Button>
                );
              })}
            </div>
          </div>
          <div>
            <InterviewFieldLabel>Số câu</InterviewFieldLabel>
            <InterviewSegmentedControl
              label="Số câu"
              options={countOptions}
              value={String(form.count)}
              onChange={(count) => changeForm({ count: Number(count) })}
            />
          </div>
          <div>
            <InterviewFieldLabel htmlFor="interview-ai-hint" hint="không bắt buộc">
              Gợi ý thêm
            </InterviewFieldLabel>
            <Textarea
              id="interview-ai-hint"
              rows={3}
              value={form.hint}
              maxLength={500}
              placeholder="Ví dụ: cleanup chạy trước effect mới khi dependency đổi"
              className="resize-y font-normal !leading-6"
              onChange={(event) => changeForm({ hint: event.target.value.slice(0, INTERVIEW_TEXT_LIMITS.explanation) })}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" disabled={isGenerating} onClick={onClose}>
            Huỷ
          </Button>
          <Button variant="primary" className="whitespace-nowrap" disabled={!canGenerate} isLoading={isGenerating} onClick={() => onGenerate(form)}>
            <Sparkles className="size-4" />
            {isGenerating ? "AI đang ra đề…" : `Tạo ${form.count} câu nháp`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
