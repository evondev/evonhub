import Skeleton from "@/shared/components/skeleton";

/** Khung chờ đúng hình trang: đầu trang, card chuyển khoản, card tóm tắt */
export function OrderDetailsSkeleton() {
  return (
    <div aria-busy="true" className="flex max-w-[68rem] flex-col gap-4 sm:gap-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-6 w-64 max-w-full rounded-full" />
        <Skeleton className="h-3 w-40 rounded-full" />
      </div>
      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="mt-2 h-3 w-2/3 max-w-sm rounded-full" />
          <div className="mt-5 grid gap-6 sm:grid-cols-[13rem_minmax(0,1fr)]">
            <Skeleton className="mx-auto hidden size-52 rounded-xl sm:block" />
            <div className="space-y-5">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-4 w-40 max-w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <Skeleton className="h-5 w-36 rounded-full" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="aspect-video w-24 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
          </div>
        </div>
      </div>
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
