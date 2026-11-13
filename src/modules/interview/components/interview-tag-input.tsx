"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";

interface InterviewTagInputProps {
  id: string;
  tags: string[];
  maxTags: number;
  maxLength: number;
  placeholder: string;
  onChange: (tags: string[]) => void;
}

/** Ô nhập nhiều tag: Enter hoặc dấu phẩy để thêm, Backspace ở ô trống để bỏ tag cuối */
export function InterviewTagInput({
  id,
  tags,
  maxTags,
  maxLength,
  placeholder,
  onChange,
}: InterviewTagInputProps) {
  const [draftTag, setDraftTag] = useState("");
  const canAddMore = tags.length < maxTags;

  function addDraftTag() {
    const nextTag = draftTag.trim();

    setDraftTag("");

    if (!nextTag || tags.includes(nextTag) || !canAddMore) return;

    onChange([...tags, nextTag]);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDraftTag();
      return;
    }

    if (event.key === "Backspace" && !draftTag && tags.length) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-border-strong bg-surface px-2 py-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 md:min-h-10">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex h-8 items-center rounded-lg bg-foreground/5 pl-2.5 text-sm text-foreground">
          {tag}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            aria-label={`Bỏ ${tag}`}
            onClick={() => onChange(tags.filter((currentTag) => currentTag !== tag))}
          >
            <X className="size-3.5" />
          </Button>
        </span>
      ))}
      {canAddMore && (
        <input
          id={id}
          value={draftTag}
          maxLength={maxLength}
          placeholder={placeholder}
          className="h-8 min-w-28 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted"
          onChange={(event) => setDraftTag(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addDraftTag}
        />
      )}
    </div>
  );
}
