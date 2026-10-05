"use client";

import Prism from "prismjs";
import { useEffect, useRef } from "react";

export interface LessonNotesProps {
  html: string;
}

// Ghi chú của bài (HTML soạn trong admin): link mở tab mới, code tô màu Prism
export function LessonNotes({ html }: LessonNotesProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    article.querySelectorAll("a").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    });
    Prism.highlightAllUnder(article);
  }, [html]);

  return (
    <article
      ref={articleRef}
      className="lesson-notes break-text rounded-2xl border border-border bg-surface p-4 sm:p-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
