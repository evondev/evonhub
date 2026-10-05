import { ExplorePage } from "@/modules/course/pages";
import { ExploreSearchParams } from "@/modules/course/types";
import { parseExploreFilters } from "@/modules/course/utils";

interface ExplorePageRootProps {
  searchParams: ExploreSearchParams;
}

export default function ExplorePageRoot({
  searchParams,
}: ExplorePageRootProps) {
  return <ExplorePage filters={parseExploreFilters(searchParams)} />;
}
