"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/button";
import MarkdownText from "./markdown-text";

interface HintListProps {
  hints: string[];
}

export default function HintList({ hints }: HintListProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const hasMoreHints = revealedCount < hints.length;

  if (hints.length === 0) return null;

  return (
    <div className="space-y-2">
      {hints.slice(0, revealedCount).map((hint, hintIndex) => (
        <div key={hint} className="flex gap-3 rounded-xl bg-background px-4 py-3">
          <span className="shrink-0 text-xs font-medium leading-6 text-muted">Gợi ý {hintIndex + 1}</span>
          <MarkdownText content={hint} />
        </div>
      ))}
      {hasMoreHints && (
        <Button variant="ghost" icon={Lightbulb} onClick={() => setRevealedCount(revealedCount + 1)}>
          {revealedCount === 0 ? "Xem gợi ý" : `Gợi ý tiếp (${revealedCount + 1}/${hints.length})`}
        </Button>
      )}
    </div>
  );
}
