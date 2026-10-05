import { fetchExploreCourses } from "../../../actions";
import { EXPLORE_PAGE_SIZE } from "../../../constants";
import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { ExploreLoadError } from "./explore-load-error";
import { ExploreResults } from "./explore-results";

interface ExploreResultsLoaderProps {
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

export async function ExploreResultsLoader({
  filters,
  linkBase,
}: ExploreResultsLoaderProps) {
  const result = await fetchExploreCourses({
    ...filters,
    limit: EXPLORE_PAGE_SIZE,
  });

  if (!result) return <ExploreLoadError />;

  return (
    <ExploreResults result={result} filters={filters} linkBase={linkBase} />
  );
}
