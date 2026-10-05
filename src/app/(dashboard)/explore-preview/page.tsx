import { PREVIEW_EXPLORE_STATE_LINKS } from "@/modules/course/constants";
import { ExplorePreviewPage } from "@/modules/course/pages/explore-page/explore-preview-page";
import {
  ExplorePreviewState,
  ExploreSearchParams,
} from "@/modules/course/types";
import { parseExploreFilters } from "@/modules/course/utils";
import { notFound } from "next/navigation";

interface ExplorePreviewRouteProps {
  searchParams: ExploreSearchParams & { tt?: string };
}

export default function ExplorePreviewRoute({
  searchParams,
}: ExplorePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_EXPLORE_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: ExplorePreviewState = matchedState?.state || "du-lieu";

  return (
    <ExplorePreviewPage
      state={state}
      filters={parseExploreFilters(searchParams)}
    />
  );
}
