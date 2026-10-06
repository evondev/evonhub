import { CHAT_PREVIEW_STATE_LINKS } from "@/modules/chat/constants";
import { ChatPreviewPage } from "@/modules/chat/pages/chat-preview";
import { ChatPreviewState } from "@/modules/chat/types";
import { notFound } from "next/navigation";

interface ChatPreviewRouteProps {
  searchParams: { tt?: string };
}

export default function ChatPreviewRoute({
  searchParams,
}: ChatPreviewRouteProps) {
  if (process.env.NODE_ENV !== "development") notFound();

  const matchedState = CHAT_PREVIEW_STATE_LINKS.find(
    (stateLink) => stateLink.state === searchParams.tt,
  );
  const state: ChatPreviewState = matchedState?.state || "du-lieu";

  return <ChatPreviewPage state={state} />;
}
