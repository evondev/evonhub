"use client";

import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { forwardRef } from "react";

interface GrantCourseSearchProps {
  value: string;
  onChange: (query: string) => void;
  onClear: () => void;
}

/** Ô tìm khóa trong hộp cấp: lọc ngay khi gõ, có nút xoá riêng thay nút của trình duyệt */
export const GrantCourseSearch = forwardRef<
  HTMLInputElement,
  GrantCourseSearchProps
>(function GrantCourseSearch({ value, onChange, onClear }, inputRef) {
  return (
    <div className="relative min-w-0">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm tên khóa học"
        aria-label="Tìm khóa học"
        className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-10 pr-10 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:h-10 md:text-sm [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          aria-label="Xoá từ khoá"
          onClick={onClear}
          className="absolute inset-y-0 right-1 my-auto size-8 rounded-lg p-0 text-muted hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
});
