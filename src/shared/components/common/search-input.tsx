"use client";

import { SEARCH_DEBOUNCE_MS } from "@/shared/constants/search.constants";
import { cn } from "@/shared/utils";
import { Search } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

interface SearchInputProps {
  /** Từ khoá đang có trên URL */
  value: string;
  onSearch: (keyword: string) => void;
  placeholder: string;
  /** Nói rõ đang tìm gì, ví dụ "Tìm thành viên" */
  label: string;
  className?: string;
}

/** Ô tìm phía trên bảng: gõ dừng một nhịp thì tìm, Enter thì tìm ngay */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { value, onSearch, placeholder, label, className },
    forwardedRef,
  ) {
    const [keyword, setKeyword] = useState(value);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

    // Từ khoá đổi từ chỗ khác (bấm "Xoá tìm kiếm", nút lùi) thì ô tìm theo.
    // Đang gõ thì giữ chữ đang gõ, kẻo kết quả về chậm ghi đè chữ mới hơn.
    useEffect(() => {
      if (document.activeElement !== inputRef.current) setKeyword(value);
    }, [value]);

    useEffect(() => () => clearTimeout(debounceTimerRef.current), []);

    function submitKeyword(nextKeyword: string) {
      clearTimeout(debounceTimerRef.current);
      onSearch(nextKeyword.trim());
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const nextKeyword = event.target.value;

      setKeyword(nextKeyword);
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(
        () => submitKeyword(nextKeyword),
        SEARCH_DEBOUNCE_MS,
      );
    }

    function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
      event.preventDefault();
      submitKeyword(keyword);
    }

    function setInputRef(element: HTMLInputElement | null) {
      inputRef.current = element;

      if (typeof forwardedRef === "function") forwardedRef(element);
      if (forwardedRef && typeof forwardedRef !== "function")
        forwardedRef.current = element;
    }

    return (
      <form
        role="search"
        onSubmit={handleSubmit}
        className={cn("relative min-w-0", className)}
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={setInputRef}
          type="search"
          value={keyword}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={label}
          className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-10 pr-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:h-10 md:text-sm"
        />
      </form>
    );
  },
);
