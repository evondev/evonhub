import { commonPath } from "@/constants";
import { IS_CHAT_ENABLED } from "@/shared/constants/common.constants";
import { ChatPage } from "@/modules/chat/pages/chat";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

// Trang phụ thuộc session Clerk nên không prerender tĩnh được
export const dynamic = "force-dynamic";

export interface ChatPageRootProps {}

export default function ChatPageRoot(_props: ChatPageRootProps) {
  if (!IS_CHAT_ENABLED) notFound();

  const { userId } = auth();

  if (!userId) {
    redirect(`${commonPath.LOGIN}?redirect_url=${encodeURIComponent("/chat")}`);
  }

  return <ChatPage />;
}
