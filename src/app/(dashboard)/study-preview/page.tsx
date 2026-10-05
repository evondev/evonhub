import { PREVIEW_STUDY_STATE_LINKS } from "@/modules/study/constants";
import { StudyPreviewPage } from "@/modules/study/pages/study-preview-page";
import { StudyPreviewState } from "@/modules/study/types";
import { notFound } from "next/navigation";

interface StudyPreviewRouteProps {
  searchParams: { tt?: string; khoa?: string };
}

export default function StudyPreviewRoute({
  searchParams,
}: StudyPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_STUDY_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: StudyPreviewState = matchedState?.state || "du-lieu";

  return <StudyPreviewPage state={state} selectedSlug={searchParams.khoa} />;
}
