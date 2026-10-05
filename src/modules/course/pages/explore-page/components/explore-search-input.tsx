"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { EXPLORE_SEARCH_DEBOUNCE_MS } from "../../../constants";

interface ExploreSearchInputProps {
  /** Từ khóa đang có trên URL */
  defaultValue: string;
}

/** Gõ dừng một nhịp thì tìm, Enter thì tìm ngay. Đổi từ khóa là về trang 1 */
export function ExploreSearchInput({ defaultValue }: ExploreSearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [keyword, setKeyword] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // URL đổi từ chỗ khác (bấm "Xoá bộ lọc", nút lùi) thì ô tìm theo URL. Đang gõ
  // thì giữ chữ đang gõ, kẻo kết quả về chậm ghi đè chữ mới hơn.
  useEffect(() => {
    if (document.activeElement !== inputRef.current) setKeyword(defaultValue);
  }, [defaultValue]);

  useEffect(() => () => clearTimeout(debounceTimerRef.current), []);

  function navigateWithKeyword(nextKeyword: string) {
    clearTimeout(debounceTimerRef.current);

    const params = new URLSearchParams(window.location.search);
    const trimmedKeyword = nextKeyword.trim();

    if (trimmedKeyword) params.set("q", trimmedKeyword);
    if (!trimmedKeyword) params.delete("q");
    params.delete("trang");

    const queryString = params.toString();

    startTransition(() => {
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextKeyword = event.target.value;

    setKeyword(nextKeyword);
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(
      () => navigateWithKeyword(nextKeyword),
      EXPLORE_SEARCH_DEBOUNCE_MS,
    );
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateWithKeyword(keyword);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative min-w-0 lg:w-80 lg:shrink-0"
    >
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        onChange={handleChange}
        placeholder="Tìm khóa học"
        aria-label="Tìm khóa học"
        aria-busy={isPending}
        className="h-11 w-full rounded-xl border border-border-strong bg-surface pl-10 pr-3.5 text-base text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/15 md:h-10 md:text-sm"
      />
    </form>
  );
}
