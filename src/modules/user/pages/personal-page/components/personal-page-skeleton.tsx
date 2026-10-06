import { CourseList } from "@/shared/components";

export function PersonalPageSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="size-16 shrink-0 animate-pulse rounded-full bg-foreground/5 sm:size-20" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-5 w-48 max-w-full animate-pulse rounded bg-foreground/5" />
          <div className="h-4 w-32 animate-pulse rounded bg-foreground/5" />
        </div>
      </div>
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">Đang học</h2>
        <CourseList isLoading>{null}</CourseList>
      </section>
    </div>
  );
}
