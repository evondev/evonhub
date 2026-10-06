import { fetchChatMessages } from "../../../actions";
import { getChatViewer } from "../../../services";
import { ChatRoom } from "./chat-room";
import { ChatRoomError } from "./chat-room-error";

/** Đọc người xem và trang tin mới nhất trên server, phòng chat hiện ra là có tin */
export async function ChatLoader() {
  const [viewer, firstPage] = await Promise.all([
    getChatViewer(),
    fetchChatMessages(),
  ]);

  if (!viewer || !firstPage) {
    return <ChatRoomError />;
  }

  return (
    <ChatRoom
      viewer={viewer}
      initialMessages={firstPage.messages}
      initialHasMore={firstPage.hasMore}
    />
  );
}
