import { PROFILE_PREVIEW_STATE_LINKS } from "@/modules/user/constants";
import { UserProfilePreviewPage } from "@/modules/user/pages";
import { ProfilePreviewState } from "@/modules/user/types";
import { notFound } from "next/navigation";

interface ProfilePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function ProfilePreviewRoute({
  searchParams,
}: ProfilePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = PROFILE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: ProfilePreviewState = matchedState?.state || "hoc-vien";

  return <UserProfilePreviewPage state={state} />;
}
