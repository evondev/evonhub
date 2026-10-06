import { commonPath } from "@/constants";
import { ChatPage } from "@/modules/chat/pages/chat";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Trang phụ thuộc session Clerk nên không prerender tĩnh được
export const dynamic = "force-dynamic";

export interface ChatPageRootProps {}

export default function ChatPageRoot(_props: ChatPageRootProps) {
  const { userId } = auth();

  if (!userId) {
    redirect(`${commonPath.LOGIN}?redirect_url=${encodeURIComponent("/chat")}`);
  }

  return <ChatPage />;
}
