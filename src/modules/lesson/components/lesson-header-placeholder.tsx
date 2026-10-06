import { ProductLogo } from "@/shared/components/product-logo";

// Giữ chỗ cho LessonHeader trong lúc chờ tải: cùng khung cố định cao 64px để
// trang không nhảy khi header thật thay vào.
export function LessonHeaderPlaceholder() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <ProductLogo />
      <span
        aria-hidden="true"
        className="hidden h-5 w-px shrink-0 bg-border-strong sm:block"
      />
      <div className="h-3 w-48 animate-pulse rounded-full bg-foreground/5 motion-reduce:animate-none" />
    </header>
  );
}
