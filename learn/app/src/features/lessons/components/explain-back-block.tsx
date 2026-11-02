"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/button";
import { useLessonProgress } from "../hooks/use-lesson-progress";
import type { ExplainBackStep } from "../types/lesson";
import KeyPointChecklist from "./key-point-checklist";
import MarkdownText from "./markdown-text";

interface ExplainBackBlockProps {
  step: ExplainBackStep;
}

export default function ExplainBackBlock({ step }: ExplainBackBlockProps) {
  const { steps, saveStep } = useLessonProgress();
  const savedText = steps[step.id]?.text ?? "";
  const [text, setText] = useState(savedText);
  const [isSaving, setIsSaving] = useState(false);

  const hasSaved = Boolean(savedText);
  const isUnchanged = text.trim() === savedText.trim();

  async function handleSave() {
    setIsSaving(true);

    try {
      await saveStep(step.id, { isDone: true, text });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <MarkdownText content={step.prompt} />
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={7}
        placeholder="Viết như đang giải thích cho đồng nghiệp, không cần chỉn chu."
        className="block w-full resize-y rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm leading-relaxed outline-hidden placeholder:text-muted focus:border-focus focus:ring-2 focus:ring-focus"
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="primary"
          icon={Save}
          isLoading={isSaving}
          disabled={!text.trim() || isUnchanged}
          onClick={handleSave}
        >
          Lưu vào journal
        </Button>
        {hasSaved && isUnchanged && (
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Check className="size-3.5" aria-hidden />
            Đã lưu ở journal/
          </span>
        )}
      </div>
      {hasSaved && <KeyPointChecklist keyPoints={step.keyPoints} />}
    </div>
  );
}
