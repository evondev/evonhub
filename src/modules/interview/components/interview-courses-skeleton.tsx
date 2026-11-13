const SKELETON_ROW_KEYS = ["first", "second", "third", "fourth"];

export function InterviewCoursesSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Đang tải khóa"
      className="max-w-3xl rounded-2xl border border-border bg-surface p-2"
    >
      <div className="flex h-8 items-center justify-between px-2.5">
        <div className="h-4 w-28 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-3 w-12 animate-pulse rounded-full bg-foreground/10" />
      </div>
      {SKELETON_ROW_KEYS.map((rowKey) => (
        <div key={rowKey} className="flex items-center gap-3 p-2.5">
          <div className="aspect-video w-20 shrink-0 animate-pulse rounded-lg bg-foreground/10 sm:w-24" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-2 w-full animate-pulse rounded-full bg-foreground/10" />
          </div>
        </div>
      ))}
    </section>
  );
}
