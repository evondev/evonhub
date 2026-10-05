import { COMMENT_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/comment/constants/comment-manage.constants";
import { CommentManagePreviewPage } from "@/modules/comment/pages";
import { CommentManagePreviewState } from "@/modules/comment/types/comment-manage.types";
import { notFound } from "next/navigation";

interface CommentManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function CommentManagePreviewRoute({
  searchParams,
}: CommentManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = COMMENT_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: CommentManagePreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return <CommentManagePreviewPage key={state} state={state} />;
}
