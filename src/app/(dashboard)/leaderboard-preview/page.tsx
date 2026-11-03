import { PREVIEW_LEADERBOARD_STATE_LINKS } from "@/modules/leaderboard/constants/leaderboard-preview.constants";
import { LeaderboardPreviewPage } from "@/modules/leaderboard/pages";
import { LeaderboardPreviewState } from "@/modules/leaderboard/types";
import { notFound } from "next/navigation";

interface LeaderboardPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function LeaderboardPreviewRoute({
  searchParams,
}: LeaderboardPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_LEADERBOARD_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: LeaderboardPreviewState = matchedState?.state || "du-lieu";

  return <LeaderboardPreviewPage state={state} />;
}
