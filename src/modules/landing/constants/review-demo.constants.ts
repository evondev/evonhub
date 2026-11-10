import {
  CheckCircle2,
  Loader2,
  ScanSearch,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import {
  ReviewDemoMessage,
  ReviewDemoPhase,
  ReviewDemoPhaseStyle,
} from "../types";

// ----- Màn diễn trong editor: AI gõ, bạn soát, phát hiện lỗi, sửa -----

export const REVIEW_DEMO_FILE_NAME = "user-list.tsx";

export const REVIEW_DEMO_CODE_LINES: string[] = [
  "export function UserList({ users }) {",
  "  return users.map((user) => (",
  "    <UserItem key={Math.random()} user={user} />",
  "  ));",
  "}",
];

// Dòng AI viết sai (chỉ số trong REVIEW_DEMO_CODE_LINES) và dòng sửa đúng
export const REVIEW_DEMO_BUG_LINE_INDEX = 2;

export const REVIEW_DEMO_FIXED_LINE =
  "    <UserItem key={user.id} user={user} />";

export const REVIEW_DEMO_BUG_TITLE = "key ngẫu nhiên";

export const REVIEW_DEMO_BUG_TEXT =
  "Mỗi lần render React tưởng là item mới: dựng lại cả danh sách, mất state bên trong.";

export const REVIEW_DEMO_DONE_TEXT =
  "Dùng id làm key: ổn định qua mỗi lần render, React giữ đúng từng item.";

// Thời lượng từng nhịp (mili giây). Gõ tính theo số ký tự
export const REVIEW_DEMO_TYPING_MS_PER_CHAR = 30;

export const REVIEW_DEMO_REVIEWING_MS = 1400;

export const REVIEW_DEMO_FLAGGED_MS = 2400;

export const REVIEW_DEMO_FIXING_MS = 1600;

export const REVIEW_DEMO_DONE_MS = 2800;

// Nhãn trạng thái ở góc editor, mỗi nhịp một màu
export const reviewDemoPhaseStyles: Record<
  ReviewDemoPhase,
  ReviewDemoPhaseStyle
> = {
  typing: {
    label: "AI ĐANG VIẾT",
    className: "text-violet-300 ring-violet-400/40",
  },
  reviewing: {
    label: "BẠN ĐANG SOÁT",
    className: "text-sky-300 ring-sky-400/40",
  },
  flagged: {
    label: "PHÁT HIỆN LỖI",
    className: "text-rose-300 ring-rose-400/50",
  },
  fixing: { label: "ĐANG SỬA", className: "text-amber-200 ring-amber-300/40" },
  done: {
    label: "ĐÃ HIỂU · ĐÃ SỬA",
    className: "text-emerald-300 ring-emerald-400/50",
  },
};

// Ô thông điệp dưới editor, mỗi nhịp một câu
export const reviewDemoMessages: Record<ReviewDemoPhase, ReviewDemoMessage> = {
  typing: {
    icon: Loader2,
    title: "AI đang viết",
    text: "component danh sách user theo yêu cầu của bạn…",
    className: "text-violet-200",
  },
  reviewing: {
    icon: ScanSearch,
    title: "Bạn đọc lại",
    text: "từng dòng trước khi đưa code lên.",
    className: "text-sky-200",
  },
  flagged: {
    icon: TriangleAlert,
    title: `Dòng 3: ${REVIEW_DEMO_BUG_TITLE}.`,
    text: REVIEW_DEMO_BUG_TEXT,
    className: "text-rose-200",
  },
  fixing: {
    icon: Wrench,
    title: "Bạn sửa",
    text: "đổi key sang id của từng user.",
    className: "text-amber-100",
  },
  done: {
    icon: CheckCircle2,
    title: "Đã hiểu, đã sửa.",
    text: REVIEW_DEMO_DONE_TEXT,
    className: "text-emerald-200",
  },
};

// Thời gian chữ trạng thái "giải mã" từ ký tự ngẫu nhiên ra chữ thật
export const SCRAMBLE_DURATION_MS = 450;

export const SCRAMBLE_CHARACTERS = "!<>-_\\/[]{}=+*^?#ABCDEF0123456789";
