import "server-only";
import Pusher from "pusher";

function createPusherServer(): Pusher | null {
  const { PUSHER_APP_ID, PUSHER_SECRET } = process.env;
  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!PUSHER_APP_ID || !PUSHER_SECRET || !pusherKey || !pusherCluster) {
    return null;
  }

  return new Pusher({
    appId: PUSHER_APP_ID,
    key: pusherKey,
    secret: PUSHER_SECRET,
    cluster: pusherCluster,
    useTLS: true,
  });
}

/** null khi chưa cấu hình env: chat vẫn chạy, client tự hỏi tin mới theo nhịp */
export const pusherServer = createPusherServer();
