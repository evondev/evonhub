import { PREVIEW_STATE_LINKS } from "@/modules/dashboard/constants";
import { DashboardPreviewPage } from "@/modules/dashboard/pages/dashboard-preview-page";
import { DashboardPreviewState } from "@/modules/dashboard/types";
import { notFound } from "next/navigation";

interface DashboardPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function DashboardPreviewRoute({
  searchParams,
}: DashboardPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: DashboardPreviewState = matchedState?.state || "nguoi-moi";

  return <DashboardPreviewPage state={state} />;
}
