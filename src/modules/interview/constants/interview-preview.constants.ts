import { PreviewStateLink } from "@/shared/types";
import type {
  InterviewAdminQuestion,
  InterviewAnswerFeedback,
  InterviewCourseSummary,
  InterviewSessionData,
} from "../types";
import {
  InterviewDifficulty,
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "./interview-enums";

/* Dữ liệu giả cho các trang xem trước (chỉ ở dev). Không đọc hay ghi DB. */

export const PREVIEW_INTERVIEW_COURSES_STATE_LINKS: PreviewStateLink[] = [
  { state: "du-lieu", label: "Có 4 khóa" },
  { state: "rong", label: "Chưa có khóa nào có câu" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

export const PREVIEW_INTERVIEW_COURSES: InterviewCourseSummary[] = [
  { id: "c1", title: "Khóa học ReactJS Master - Nắm vững kiến thức React chuyên sâu", slug: "reactjs-master", image: "", totalQuestions: 40, answeredCount: 18, wrongCount: 3, points: 26, lastPracticedAt: "2026-11-13T08:00:00.000Z" },
  { id: "c2", title: "Khóa học NextJS Pro - Xây dựng E Learning System hoàn chỉnh từ A tới Z", slug: "nextjs-pro", image: "", totalQuestions: 24, answeredCount: 0, wrongCount: 0, points: 0 },
  { id: "c3", title: "Khóa học Typescript cơ bản dành cho người mới", slug: "typescript", image: "", totalQuestions: 30, answeredCount: 30, wrongCount: 0, points: 52, lastPracticedAt: "2026-11-10T08:00:00.000Z" },
  { id: "c4", title: "Khóa học Javascript từ cơ bản đến nâng cao cho người mới bắt đầu", slug: "javascript", image: "", totalQuestions: 36, answeredCount: 12, wrongCount: 5, points: 14, lastPracticedAt: "2026-11-08T08:00:00.000Z" },
];

const counterCode = `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleClick}>{count}</button>;
}`;

const timerCode = `function Timer({ id }) {
  useEffect(() => {
    console.log("effect", id);
    return () => console.log("cleanup", id);
  }, [id]);

  console.log("render", id);
  return null;
}
// id: 1 → 2`;

export const PREVIEW_INTERVIEW_SESSION: InterviewSessionData = {
  course: { id: "c1", title: PREVIEW_INTERVIEW_COURSES[0].title, slug: "reactjs-master" },
  points: 26,
  questions: [
    {
      id: "q1",
      type: InterviewQuestionType.Predict,
      difficulty: InterviewDifficulty.Medium,
      prompt: "Bấm nút một lần, nút hiện số mấy?",
      code: counterCode,
      version: "React 18+",
      tags: ["useState", "batching"],
      options: [
        { id: "o3", text: "3" },
        { id: "o1", text: "0" },
        { id: "o4", text: "Báo lỗi: gọi setState nhiều lần liên tiếp" },
        { id: "o2", text: "1" },
      ],
      logItems: [],
      progress: "todo",
    },
    {
      id: "q2",
      type: InterviewQuestionType.LogOrder,
      difficulty: InterviewDifficulty.Hard,
      prompt: "Component mount với id = 1, sau đó id đổi thành 2. Log in ra theo thứ tự nào?",
      code: timerCode,
      version: "React 18+",
      tags: ["useEffect", "cleanup"],
      options: [],
      logItems: [
        { index: 4, text: "effect 2" },
        { index: 0, text: "render 1" },
        { index: 3, text: "cleanup 1" },
        { index: 1, text: "effect 1" },
        { index: 2, text: "render 2" },
      ],
      progress: "todo",
    },
  ],
};

const counterSources = [
  { url: "https://react.dev/learn/queueing-a-series-of-state-updates", title: "Queueing a Series of State Updates" },
];

const timerSources = [
  { url: "https://react.dev/learn/synchronizing-with-effects", title: "Synchronizing with Effects" },
];

/** Đáp án của từng câu giả: trang xem trước tự chấm, không gọi server */
export const PREVIEW_INTERVIEW_ANSWER_KEYS: Record<string, Omit<InterviewAnswerFeedback, "attemptId" | "isCorrect" | "isFirstAttempt" | "pointsAwarded">> = {
  q1: {
    correctOptionId: "o2",
    explanation:
      "Trong lần render này count là 0. Cả ba lần gọi đều là setCount(0 + 1), React gom lại rồi render một lần với giá trị 1. Muốn tăng đủ 3, truyền hàm cập nhật: setCount(c => c + 1).",
    keyPoints: [
      "count là giá trị của lần render này (0), không đổi giữa ba lần gọi",
      "React gom các lần cập nhật rồi render lại một lần",
      "Muốn cộng dồn thì truyền hàm cập nhật: setCount(c => c + 1)",
    ],
    sources: counterSources,
    version: "React 18+",
  },
  q2: {
    correctLogItems: ["render 1", "effect 1", "render 2", "cleanup 1", "effect 2"],
    explanation:
      "Effect chạy sau khi render xong. Khi id đổi, React render lại trước, rồi chạy cleanup của effect cũ (với id = 1), sau đó mới chạy effect mới với id = 2.",
    keyPoints: [
      "Effect chạy sau render, không chạy trong lúc render",
      "Dependency đổi thì cleanup của lần trước chạy trước effect mới",
      "Cleanup đọc giá trị của lần render cũ (id = 1)",
    ],
    sources: timerSources,
    version: "React 18+",
  },
};

export const PREVIEW_INTERVIEW_MANAGE_STATE_LINKS: PreviewStateLink[] = [
  { state: "du-lieu", label: "Có câu chờ duyệt" },
  { state: "rong", label: "Chưa có câu" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
  { state: "tao-ai", label: "Hộp tạo bằng AI" },
];

export const PREVIEW_INTERVIEW_ADMIN_QUESTIONS: InterviewAdminQuestion[] = [
  {
    id: "q1",
    courseId: "c1",
    type: InterviewQuestionType.Predict,
    status: InterviewQuestionStatus.Draft,
    origin: InterviewQuestionOrigin.Ai,
    difficulty: InterviewDifficulty.Medium,
    version: "React 18+",
    prompt: "Bấm nút một lần, nút hiện số mấy? (setCount(count + 1) gọi ba lần)",
    code: counterCode,
    options: [
      { text: "0", isCorrect: false },
      { text: "1", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "Báo lỗi: gọi setState nhiều lần liên tiếp", isCorrect: false },
    ],
    logItems: [],
    explanation: PREVIEW_INTERVIEW_ANSWER_KEYS.q1.explanation,
    keyPoints: PREVIEW_INTERVIEW_ANSWER_KEYS.q1.keyPoints,
    sources: [
      {
        url: "https://react.dev/learn/queueing-a-series-of-state-updates",
        title: "Queueing a Series of State Updates",
        quote: "React waits until all code in the event handlers has run before processing your state updates.",
        isQuoteVerified: true,
      },
      {
        url: "https://react.dev/reference/react/useState",
        title: "useState",
        quote: "Calling the set function three times will increment the counter only once.",
        isQuoteVerified: false,
      },
    ],
    tags: ["useState", "batching"],
    sourcePages: [],
    createdAt: "2026-11-13T03:24:00.000Z",
    updatedAt: "2026-11-13T03:24:00.000Z",
    stats: { learnerCount: 0, correctCount: 0 },
  },
  {
    id: "q2",
    courseId: "c1",
    type: InterviewQuestionType.LogOrder,
    status: InterviewQuestionStatus.Draft,
    origin: InterviewQuestionOrigin.Ai,
    difficulty: InterviewDifficulty.Hard,
    version: "React 18+",
    prompt: "Component mount với id = 1 rồi đổi thành 2, log in ra theo thứ tự nào?",
    code: timerCode,
    options: [],
    logItems: ["render 1", "effect 1", "render 2", "cleanup 1", "effect 2"],
    explanation: PREVIEW_INTERVIEW_ANSWER_KEYS.q2.explanation,
    keyPoints: PREVIEW_INTERVIEW_ANSWER_KEYS.q2.keyPoints,
    sources: [
      {
        url: "https://react.dev/learn/synchronizing-with-effects",
        title: "Synchronizing with Effects",
        quote: "React will call your cleanup function each time before the Effect runs again, and one final time when the component unmounts.",
        isQuoteVerified: true,
      },
    ],
    tags: ["useEffect", "cleanup"],
    sourcePages: [],
    createdAt: "2026-11-13T03:24:00.000Z",
    updatedAt: "2026-11-13T03:24:00.000Z",
    stats: { learnerCount: 0, correctCount: 0 },
  },
  {
    id: "q3",
    courseId: "c1",
    type: InterviewQuestionType.Concept,
    status: InterviewQuestionStatus.Published,
    origin: InterviewQuestionOrigin.Manual,
    difficulty: InterviewDifficulty.Easy,
    version: "React 18+",
    prompt: "Ref đổi giá trị có làm component render lại không?",
    code: "",
    options: [
      { text: "Có, giống state", isCorrect: false },
      { text: "Không, ref đổi không gây render lại", isCorrect: true },
      { text: "Chỉ khi ref gắn vào phần tử DOM", isCorrect: false },
    ],
    logItems: [],
    explanation: "Đổi ref.current không báo cho React biết, nên component không render lại. Dùng ref cho giá trị không cần hiện lên màn hình.",
    keyPoints: ["Đổi ref.current không kích hoạt render", "Dùng state khi giá trị cần hiện lên giao diện"],
    sources: [
      {
        url: "https://react.dev/learn/referencing-values-with-refs",
        title: "Referencing Values with Refs",
        quote: "Changing a ref does not trigger a re-render.",
        isQuoteVerified: true,
      },
    ],
    tags: ["useRef"],
    sourcePages: [],
    createdAt: "2026-10-28T03:24:00.000Z",
    updatedAt: "2026-10-28T03:24:00.000Z",
    // Ít người đúng: để thấy badge nhắc đọc lại đáp án
    stats: { learnerCount: 24, correctCount: 3 },
  },
];
