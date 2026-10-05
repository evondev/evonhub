import { USER_MANAGE_PREVIEW_STATE_LINKS } from "@/modules/user/constants/user-manage.constants";
import { UserManagePreviewPage } from "@/modules/user/pages";
import { UserManagePreviewState } from "@/modules/user/types/user-manage.types";
import { notFound } from "next/navigation";

interface UserManagePreviewRouteProps {
  searchParams: { tt?: string };
}

export default function UserManagePreviewRoute({
  searchParams,
}: UserManagePreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = USER_MANAGE_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: UserManagePreviewState = matchedState?.state || "du-lieu";

  // key: đổi trạng thái thì dựng lại trang, bộ lọc về mặc định của trạng thái đó
  return <UserManagePreviewPage key={state} state={state} />;
}
