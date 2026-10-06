import { Suspense } from "react";
import { ChatLoader, ChatRoomSkeleton } from "./components";

export interface ChatPageProps {}

export function ChatPage(_props: ChatPageProps) {
  return (
    <Suspense fallback={<ChatRoomSkeleton />}>
      <ChatLoader />
    </Suspense>
  );
}
