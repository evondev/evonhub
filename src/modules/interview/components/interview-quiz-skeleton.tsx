const OPTION_SKELETON_KEYS = ["first", "second", "third", "fourth"];

export function InterviewQuizSkeleton() {
  return (
    <div className="mx-auto max-w-3xl" aria-busy="true" aria-label="Đang tải câu hỏi">
      <div className="mb-4 flex flex-col gap-3">
        <div className="h-9 w-3/5 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-2 w-full animate-pulse rounded-full bg-foreground/10" />
      </div>
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-foreground/10" />
          <div className="h-6 w-24 animate-pulse rounded-full bg-foreground/10" />
        </div>
        <div className="h-4 w-3/5 animate-pulse rounded-full bg-foreground/10" />
        <div className="h-64 animate-pulse rounded-xl bg-foreground/10" />
        <div className="flex flex-col gap-2">
          {OPTION_SKELETON_KEYS.map((optionKey) => (
            <div key={optionKey} className="h-12 animate-pulse rounded-xl bg-foreground/[0.06]" />
          ))}
        </div>
      </div>
    </div>
  );
}
