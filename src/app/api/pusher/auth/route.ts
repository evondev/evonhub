import { CHAT_CHANNEL_NAME } from "@/modules/chat/constants";
import { getChatViewer } from "@/modules/chat/services";
import { getNotificationChannelName } from "@/modules/notifications/utils/notification-channel.utils";
import { getCurrentUser } from "@/shared/libs/auth";
import { pusherServer } from "@/shared/libs/pusher";
import { NextResponse } from "next/server";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

/**
 * Pusher gọi vào đây trước khi cho vào kênh cần quyền. Cả app dùng chung một
 * kết nối nên mọi kênh auth ở đây:
 * - presence chat: người đã đăng nhập, không bị khoá; thông tin online lấy từ DB.
 * - thông báo riêng: mỗi người chỉ vào đúng kênh của mình.
 */
export async function POST(request: Request) {
  if (!pusherServer) {
    return NextResponse.json(
      { error: "Pusher chưa cấu hình" },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const socketId = formData.get("socket_id");
  const channelName = formData.get("channel_name");

  if (typeof socketId !== "string" || typeof channelName !== "string") {
    return forbidden();
  }

  if (channelName === CHAT_CHANNEL_NAME) {
    const viewer = await getChatViewer();

    if (!viewer) return forbidden();

    return NextResponse.json(
      pusherServer.authorizeChannel(socketId, channelName, {
        user_id: viewer.userId,
        user_info: {
          name: viewer.name,
          username: viewer.username,
          avatar: viewer.avatar,
          role: viewer.role,
        },
      }),
    );
  }

  const currentUser = await getCurrentUser();

  if (
    !currentUser ||
    channelName !== getNotificationChannelName(String(currentUser._id))
  ) {
    return forbidden();
  }

  return NextResponse.json(
    pusherServer.authorizeChannel(socketId, channelName),
  );
}
