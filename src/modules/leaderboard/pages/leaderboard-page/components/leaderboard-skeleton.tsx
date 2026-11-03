import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";
import { SKELETON_NAME_WIDTHS } from "../../../constants";
import { LeaderboardLayout } from "./leaderboard-layout";

const PODIUM_SLOT_KEYS: string[] = ["first", "second", "third"];

/** Khung chờ đúng hình thẻ của bạn, bục top 3 và các dòng bảng */
export function LeaderboardSkeleton() {
  const meCard = (
    <>
      <section
        aria-busy="true"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
      >
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-[86px] rounded-xl" />
          <Skeleton className="h-[86px] rounded-xl" />
        </div>
        <Skeleton className="h-3 w-4/5 rounded-full" />
        <Skeleton className="h-10 rounded-xl" />
      </section>
      <section
        aria-busy="true"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
      >
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2 rounded-full" />
            <Skeleton className="h-3 w-1/3 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-2 rounded-full" />
      </section>
    </>
  );

  return (
    <LeaderboardLayout meCard={meCard}>
      <section
        aria-busy="true"
        className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
      >
        {PODIUM_SLOT_KEYS.map((slotKey) => (
          <div
            key={slotKey}
            className="flex flex-col items-center gap-2 bg-surface px-2 py-5"
          >
            <Skeleton className="size-7 rounded-full" />
            <Skeleton className="size-12 rounded-full sm:size-14" />
            <Skeleton className="h-3 w-3/4 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </section>
      <section
        aria-busy="true"
        className="rounded-2xl border border-border bg-surface py-3"
      >
        <ul className="flex flex-col gap-1 px-2">
          {SKELETON_NAME_WIDTHS.map((nameWidth, index) => (
            <li key={index} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="h-3 w-6 rounded-full" />
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <Skeleton className={cn("h-3 rounded-full", nameWidth)} />
              </div>
              <Skeleton className="h-3 w-16 rounded-full" />
            </li>
          ))}
        </ul>
      </section>
      <span className="sr-only" role="status">
        Đang tải bảng xếp hạng
      </span>
    </LeaderboardLayout>
  );
}
