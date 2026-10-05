import { Suspense } from "react";
import { ExploreFilters, ExploreLinkBase } from "../../types";
import {
  ExploreFilterBar,
  ExploreResultsLoader,
  ExploreSkeleton,
} from "./components";

interface ExplorePageProps {
  filters: ExploreFilters;
}

const exploreLinkBase: ExploreLinkBase = { basePath: "/explore" };

export function ExplorePage({ filters }: ExplorePageProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <ExploreFilterBar filters={filters} linkBase={exploreLinkBase} />
      {/* key theo bộ lọc: đổi lọc thì phần kết quả hiện khung chờ, thanh lọc giữ nguyên */}
      <Suspense key={JSON.stringify(filters)} fallback={<ExploreSkeleton />}>
        <ExploreResultsLoader filters={filters} linkBase={exploreLinkBase} />
      </Suspense>
    </div>
  );
}
