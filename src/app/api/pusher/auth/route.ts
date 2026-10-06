import { CHAT_CHANNEL_NAME } from "@/modules/chat/constants";
import { getChatViewer } from "@/modules/chat/services";
import { pusherServer } from "@/shared/libs/pusher";
import { NextResponse } from "next/server";

/**
 * Pusher gọi vào đây trước khi cho vào presence channel. Chỉ người đã đăng
 * nhập, không bị khoá mới được vào; thông tin hiện ở danh sách online lấy từ DB.
 */
export async function POST(request: Request) {
  if (!pusherServer) {
    return NextResponse.json({ error: "Pusher chưa cấu hình" }, { status: 503 });
  }

  const viewer = await getChatViewer();

  if (!viewer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const formData = await request.formData();
  const socketId = formData.get("socket_id");
  const channelName = formData.get("channel_name");

  if (typeof socketId !== "string" || channelName !== CHAT_CHANNEL_NAME) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
    user_id: viewer.userId,
    user_info: {
      name: viewer.name,
      username: viewer.username,
      avatar: viewer.avatar,
      role: viewer.role,
    },
  });

  return NextResponse.json(authResponse);
}
