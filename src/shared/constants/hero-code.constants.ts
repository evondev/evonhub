import type { HeroCodeLine } from "@/shared/types";

// Đoạn code AI viết chạy được nhưng sai nền tảng React, minh hoạ ý "có AI vẫn
// phải hiểu code". Cùng chủ đề bài học thử "giá trị random cho key". Dùng ở
// hero của landing và dashboard
export const HERO_CODE_FILE_NAME = "user-list.tsx · AI vừa viết";

export const HERO_CODE_LINES: HeroCodeLine[] = [
  { code: "export function UserList({ users }) {" },
  { code: "  return users.map((user) => (" },
  { code: "    <UserItem key={Math.random()} user={user} />", isFlagged: true },
  { code: "  ));" },
  { code: "}" },
];

export const HERO_CODE_WARNING_TITLE = "Dòng 3: key ngẫu nhiên.";

export const HERO_CODE_WARNING_TEXT =
  "Mỗi lần render React tưởng là item mới, dựng lại cả danh sách và mất state bên trong.";
