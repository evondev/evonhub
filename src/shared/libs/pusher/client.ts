import type PusherClient from "pusher-js";

// Next thay NEXT_PUBLIC_* lúc build nên phải đọc đúng tên biến, không destructure
const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

/** Một route auth cho mọi kênh cần quyền (chat, thông báo riêng) */
export const PUSHER_AUTH_ENDPOINT = "/api/pusher/auth";

export const IS_PUSHER_CONFIGURED = Boolean(PUSHER_KEY && PUSHER_CLUSTER);

let pusherClientPromise: Promise<PusherClient> | null = null;

/**
 * Client Pusher dùng chung cả app: một tab một kết nối, mỗi tính năng tự
 * subscribe kênh của mình. Rời trang thì unsubscribe kênh, không disconnect,
 * vì tính năng khác vẫn đang dùng kết nối.
 * Tải lười pusher-js; chưa cấu hình env thì trả null.
 */
export function getPusherClient(): Promise<PusherClient> | null {
  const pusherKey = PUSHER_KEY;
  const pusherCluster = PUSHER_CLUSTER;

  if (!pusherKey || !pusherCluster) return null;

  if (!pusherClientPromise) {
    pusherClientPromise = import("pusher-js").then(
      ({ default: Pusher }) =>
        new Pusher(pusherKey, {
          cluster: pusherCluster,
          channelAuthorization: {
            endpoint: PUSHER_AUTH_ENDPOINT,
            transport: "ajax",
          },
        }),
    );
  }

  return pusherClientPromise;
}
