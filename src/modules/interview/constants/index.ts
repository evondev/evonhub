import type {
  InterviewChoiceOption,
  InterviewManageTab,
  InterviewSourceDomain,
} from "../types";
import {
  InterviewDifficulty,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "./interview-enums";

export {
  InterviewDifficulty,
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "./interview-enums";

export const INTERVIEW_PATH = "/interview";

export const INTERVIEW_ADMIN_PATH = "/admin/interview/manage";

/** Từ chừng này người làm trở lên mới xét tỉ lệ đúng, ít hơn thì chưa đủ để nói gì */
export const INTERVIEW_LOW_CORRECT_MIN_LEARNERS = 5;

/** Tỉ lệ đúng lượt đầu dưới mức này thì nhắc Admin đọc lại đáp án */
export const INTERVIEW_LOW_CORRECT_RATE = 0.2;

/** Điểm cộng khi đúng ngay lần nộp đầu, theo độ khó */
export const INTERVIEW_POINTS_BY_DIFFICULTY: Record<
  InterviewDifficulty,
  number
> = {
  [InterviewDifficulty.Easy]: 1,
  [InterviewDifficulty.Medium]: 2,
  [InterviewDifficulty.Hard]: 3,
};

export const INTERVIEW_DIFFICULTY_LABELS: Record<InterviewDifficulty, string> =
  {
    [InterviewDifficulty.Easy]: "Dễ",
    [InterviewDifficulty.Medium]: "Vừa",
    [InterviewDifficulty.Hard]: "Khó",
  };

export const INTERVIEW_TYPE_LABELS: Record<InterviewQuestionType, string> = {
  [InterviewQuestionType.Predict]: "Đoán kết quả",
  [InterviewQuestionType.LogOrder]: "Sắp xếp log",
  [InterviewQuestionType.Concept]: "Khái niệm",
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewQuestionStatus, string> =
  {
    [InterviewQuestionStatus.Draft]: "Chờ duyệt",
    [InterviewQuestionStatus.Published]: "Đã đăng",
  };

/** Nguồn chính chủ được nhận. Link ngoài danh sách này bị loại */
export const INTERVIEW_SOURCE_DOMAINS: InterviewSourceDomain[] = [
  { host: "react.dev", label: "React" },
  { host: "nextjs.org", label: "Next.js" },
  { host: "developer.mozilla.org", label: "JavaScript (MDN)" },
  { host: "www.typescriptlang.org", label: "TypeScript" },
  { host: "typescriptlang.org", label: "TypeScript" },
];

export const INTERVIEW_OPTION_LIMITS = { min: 2, max: 4 };

export const INTERVIEW_LOG_ITEM_LIMITS = { min: 3, max: 8 };

export const INTERVIEW_KEY_POINT_LIMITS = { min: 1, max: 3 };

export const INTERVIEW_SOURCE_LIMIT = 3;

export const INTERVIEW_TEXT_LIMITS = {
  prompt: 300,
  code: 1500,
  option: 200,
  logItem: 80,
  explanation: 2000,
  keyPoint: 200,
  quote: 500,
  version: 30,
  tag: 30,
  /** Bài học viên tự giải thích "vì sao" */
  studentExplanation: 1000,
};

export const INTERVIEW_TAG_LIMIT = 6;

/**
 * Số câu Admin chọn được khi tạo bằng AI. Chưa có 20: một lô 20 câu suy nghĩ mức
 * medium dễ quá 60 giây, server action bị cắt giữa chừng
 */
export const INTERVIEW_AI_COUNT_OPTIONS = [5, 10];

export const INTERVIEW_AI_DEFAULT_COUNT = 10;

/** Số trang tài liệu tối đa cho một lần tạo bằng AI */
export const INTERVIEW_AI_PAGE_LIMIT = 3;

/** Cắt chữ mỗi trang tài liệu trước khi đưa vào prompt (khoảng 10k token) */
export const INTERVIEW_DOC_CHAR_LIMIT = 40_000;

export const INTERVIEW_DOC_FETCH_TIMEOUT_MS = 10_000;

export const INTERVIEW_ADMIN_PAGE_SIZE = 20;

export const INTERVIEW_MANAGE_DEFAULT_FILTERS = {
  courseId: "",
  tab: InterviewQuestionStatus.Draft as InterviewManageTab,
  search: "",
};

export const INTERVIEW_AI_INSTRUCTIONS = `Bạn là người ra đề phỏng vấn frontend cho học viên Việt Nam.
Viết câu hỏi bằng tiếng Việt tự nhiên, code và tên API giữ nguyên tiếng Anh.

Luật bắt buộc:
- Chỉ ra đề từ nội dung các trang tài liệu được đưa vào. Không dùng kiến thức ngoài các trang đó.
- Mỗi câu phải có ít nhất một nguồn: url là một trong các trang đã đưa, quote là một câu chép NGUYÊN VĂN (tiếng Anh, đúng từng chữ) từ trang đó, làm căn cứ cho đáp án.
- Code ngắn: tối đa 15 dòng, mỗi dòng tối đa 50 ký tự, thụt lề 2 dấu cách.
- Dạng "predict": hỏi code chạy ra gì, 3–4 đáp án, đúng một đáp án đúng. Đáp án sai phải là lỗi hiểu sai phổ biến, không vô lý.
- Dạng "concept": câu hỏi khái niệm, 3–4 đáp án, đúng một đáp án đúng. code để chuỗi rỗng nếu không cần.
- Dạng "log-order": code có console.log, logItems liệt kê các dòng log theo ĐÚNG thứ tự in ra (3–8 dòng). Mỗi dòng log phải KHÁC nhau, nên gắn nhãn chỗ in, ví dụ console.log("render", n), console.log("effect", n). Nếu các dòng in ra giống nhau thì đổi sang dạng "predict". options để mảng rỗng.
- explanation: giải thích vì sao đáp án đúng, 2–4 câu, như người phỏng vấn giải thích lại.
- keyPoints: 2–3 ý chính học viên cần nói được khi trả lời "vì sao", mỗi ý một câu ngắn.
- version: phiên bản áp dụng, ví dụ "React 18+", "Next.js 15", "ES2022".
- Không lặp lại các câu đã có.`;

export const INTERVIEW_TYPE_OPTIONS: InterviewChoiceOption<InterviewQuestionType>[] = [
  { value: InterviewQuestionType.Predict, label: INTERVIEW_TYPE_LABELS[InterviewQuestionType.Predict] },
  { value: InterviewQuestionType.LogOrder, label: INTERVIEW_TYPE_LABELS[InterviewQuestionType.LogOrder] },
  { value: InterviewQuestionType.Concept, label: INTERVIEW_TYPE_LABELS[InterviewQuestionType.Concept] },
];

export const INTERVIEW_DIFFICULTY_OPTIONS: InterviewChoiceOption<InterviewDifficulty>[] = [
  { value: InterviewDifficulty.Easy, label: INTERVIEW_DIFFICULTY_LABELS[InterviewDifficulty.Easy] },
  { value: InterviewDifficulty.Medium, label: INTERVIEW_DIFFICULTY_LABELS[InterviewDifficulty.Medium] },
  { value: InterviewDifficulty.Hard, label: INTERVIEW_DIFFICULTY_LABELS[InterviewDifficulty.Hard] },
];

export const INTERVIEW_MANAGE_TAB_VALUES = [
  InterviewQuestionStatus.Draft,
  InterviewQuestionStatus.Published,
  "all",
] as const;

export const INTERVIEW_MANAGE_TABS: InterviewChoiceOption<InterviewManageTab>[] = [
  { value: InterviewQuestionStatus.Draft, label: INTERVIEW_STATUS_LABELS[InterviewQuestionStatus.Draft] },
  { value: InterviewQuestionStatus.Published, label: INTERVIEW_STATUS_LABELS[InterviewQuestionStatus.Published] },
  { value: "all", label: "Tất cả" },
];

/** Gợi ý chủ đề trong hộp tạo bằng AI; Admin gõ thêm được */
export const INTERVIEW_AI_TOPIC_SUGGESTIONS = [
  "useState",
  "useEffect",
  "cleanup",
  "batching",
  "closure",
  "StrictMode",
  "useRef",
  "key",
  "event loop",
  "Server Component",
];
