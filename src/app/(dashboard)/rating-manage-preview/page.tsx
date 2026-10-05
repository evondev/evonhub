import { RATING_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/rating/constants/rating-manage.constants";
import { RatingManagePreviewPage } from "@/modules/rating/pages";
import { RatingManagePreviewState } from "@/modules/rating/types/rating-manage.types";
import { notFound } from "next/navigation";

interface RatingManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function RatingManagePreviewRoute({
  searchParams,
}: RatingManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = RATING_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: RatingManagePreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return <RatingManagePreviewPage key={state} state={state} />;
}
