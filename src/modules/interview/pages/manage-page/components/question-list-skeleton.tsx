const SKELETON_ROW_KEYS = ["first", "second", "third", "fourth", "fifth"];

export function QuestionListSkeleton() {
  return (
    <div aria-busy="true" aria-label="Đang tải câu hỏi" className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <div className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-2">
        {SKELETON_ROW_KEYS.map((rowKey) => (
          <div key={rowKey} className="flex flex-col gap-2 p-3">
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-foreground/10" />
            <div className="h-3 w-2/5 animate-pulse rounded-full bg-foreground/10" />
          </div>
        ))}
      </div>
      <div className="hidden h-96 animate-pulse rounded-2xl bg-foreground/[0.06] lg:block" />
    </div>
  );
}
