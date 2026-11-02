import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { LabLinkStep } from "../types/lesson";
import MarkdownText from "./markdown-text";

interface LabLinkBlockProps {
  step: LabLinkStep;
}

export default function LabLinkBlock({ step }: LabLinkBlockProps) {
  const { lesson } = step;

  return (
    <div className="space-y-4">
      <MarkdownText content={step.prompt} className="max-w-[75ch]" />
      <Link
        href={`/lessons/${lesson.slug}`}
        className="group flex items-center justify-between gap-4 rounded-xl border border-border-strong bg-surface p-4 transition-colors hover:border-primary/40 sm:p-5"
      >
        <span className="min-w-0 space-y-1">
          <span className="block text-xs font-medium text-muted">Bài {lesson.number}</span>
          <span className="block text-base font-semibold">{lesson.title}</span>
          <span className="block max-w-[75ch] text-sm text-muted">{lesson.summary}</span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden />
            {lesson.minutes} phút
          </span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-primary" aria-hidden />
      </Link>
    </div>
  );
}
