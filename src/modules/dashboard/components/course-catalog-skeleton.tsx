import Skeleton from "@/shared/components/skeleton";
import { CATALOG_LIST_LIMIT } from "../constants";
import { SkeletonBar } from "./skeleton-bar";

/** Cùng khung với CourseCatalogSection: một khóa lớn và danh sách bên cạnh */
export function CourseCatalogSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex h-7 items-center justify-between gap-3">
        <SkeletonBar className="h-5 w-28" />
        <SkeletonBar className="w-16" />
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface sm:flex-row lg:col-span-2">
          <Skeleton className="aspect-video w-full shrink-0 sm:aspect-auto sm:min-h-64 sm:w-1/2" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 sm:p-5">
            <SkeletonBar className="w-24" />
            <div className="mt-1 space-y-2.5">
              <SkeletonBar className="h-4 w-11/12" />
              <SkeletonBar className="h-4 w-3/5" />
            </div>
            <div className="mt-2 space-y-2">
              <SkeletonBar className="w-full" />
              <SkeletonBar className="w-4/5" />
            </div>
            <div className="mt-auto flex items-center justify-between gap-3 pt-3">
              <SkeletonBar className="h-4 w-20" />
              <SkeletonBar className="w-10" />
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border border-border bg-surface p-2">
          <ul className="flex flex-col">
            {Array.from({ length: CATALOG_LIST_LIMIT }, (_, index) => (
              <li key={index} className="flex items-center gap-3 p-2">
                <Skeleton className="aspect-video w-24 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <SkeletonBar className="w-full" />
                  <SkeletonBar className="w-3/5" />
                  <SkeletonBar className="mt-1 w-20" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
