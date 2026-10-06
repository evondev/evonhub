import { PreviewStateSwitcher } from "@/shared/components/common/preview-state-switcher";
import { cn } from "@/shared/utils";
import {
  CHAT_FRAME_HEIGHT_CLASS_NAME,
  CHAT_PREVIEW_STATE_LINKS,
} from "../../constants";
import { ChatPreviewState } from "../../types";
import { ChatRoomError, ChatRoomSkeleton } from "../chat/components";
import { ChatPreviewRoom } from "./components";

interface ChatPreviewPageProps {
  state: ChatPreviewState;
}

/** Trang xem trước phòng chat bằng tin giả. Không đọc DB, không nối Pusher, chỉ mở ở dev */
export function ChatPreviewPage({ state }: ChatPreviewPageProps) {
  const isRoomState = state !== "dang-tai" && state !== "loi";

  return (
    // Thanh trạng thái và khung chat chia nhau đúng chiều cao viewport như trang thật
    <div className={cn("flex flex-col gap-3", CHAT_FRAME_HEIGHT_CLASS_NAME)}>
      <PreviewStateSwitcher
        links={CHAT_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      {state === "dang-tai" && <ChatRoomSkeleton className="min-h-0 flex-1" />}
      {state === "loi" && <ChatRoomError className="min-h-0 flex-1" />}
      {/* key: đổi trạng thái là dựng lại danh sách tin giả từ đầu */}
      {isRoomState && <ChatPreviewRoom key={state} state={state} />}
    </div>
  );
}
