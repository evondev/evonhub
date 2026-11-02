import { ACTIVITY_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/activity/constants/activity-manage-preview.constants";
import { ActivityManagePreviewPage } from "@/modules/activity/pages";
import { ActivityManagePreviewState } from "@/modules/activity/types";
import { notFound } from "next/navigation";

interface ActivityManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function ActivityManagePreviewRoute({
  searchParams,
}: ActivityManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = ACTIVITY_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state = (matchedState?.state || "du-lieu") as ActivityManagePreviewState;

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return <ActivityManagePreviewPage key={state} state={state} />;
}
