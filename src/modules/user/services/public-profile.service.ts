import "server-only";

import { cache } from "react";
import { fetchUserByUsername } from "../actions";

/**
 * Hồ sơ công khai theo username, đọc một lần mỗi request: page.tsx tra trước để
 * trả 404 thật khi không có user, trang trong Suspense dùng lại kết quả này.
 * Không export ở barrel services: barrel đó client cũng import.
 */
export const getPublicProfile = cache((username: string) =>
  fetchUserByUsername({ username }),
);
