"use client";

import { sanitizeHtml } from "@/shared/helpers";
import Prism from "prismjs";
import { useEffect, useMemo, useRef } from "react";

export interface LessonNotesProps {
  html: string;
}

// Ghi chú của bài (HTML soạn trong admin): link mở tab mới, code tô màu Prism
export function LessonNotes({ html }: LessonNotesProps) {
  const articleRef = useRef<HTMLElement>(null);
  // Nội dung cũ lưu trước khi có làm sạch lúc lưu: làm sạch lại lúc hiện
  const safeHtml = useMemo(() => sanitizeHtml(html), [html]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    article.querySelectorAll("a").forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
    });
    Prism.highlightAllUnder(article);
  }, [safeHtml]);

  return (
    <article
      ref={articleRef}
      className="lesson-notes break-text rounded-2xl border border-border bg-surface p-4 sm:p-5"
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
