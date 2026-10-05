import { Loading } from "./loading";
import { LoadingOutline } from "./loading-outline";

export interface LoadingLessonDetailsProps {}

// Cùng lưới với DetailsPageLayout: cột bài học + mục lục 380px từ lg
export function LoadingLessonDetails(_props: LoadingLessonDetailsProps) {
  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6">
      <Loading />
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface lg:block">
        <div className="space-y-3 p-5 pt-4">
          <div className="skeleton h-4 w-40 rounded-full" />
          <div className="skeleton h-3 w-32 rounded-full" />
          <div className="skeleton h-2 w-full rounded-full" />
        </div>
        <LoadingOutline />
      </div>
    </div>
  );
}
