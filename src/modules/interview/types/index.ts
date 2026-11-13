import { Document, Schema } from "mongoose";
import {
  InterviewDifficulty,
  InterviewQuestionOrigin,
  InterviewQuestionStatus,
  InterviewQuestionType,
} from "../constants/interview-enums";

/* ===== Model ===== */

export interface InterviewOptionModelProps {
  _id: Schema.Types.ObjectId;
  text: string;
  isCorrect: boolean;
}

export interface InterviewSourceModelProps {
  url: string;
  title: string;
  /** Câu trích nguyên văn từ trang tài liệu, làm căn cứ cho đáp án */
  quote: string;
  /** Server đã tìm thấy đoạn trích trong trang tài liệu */
  isQuoteVerified: boolean;
}

export interface InterviewQuestionModelProps extends Document {
  course: Schema.Types.ObjectId;
  type: InterviewQuestionType;
  status: InterviewQuestionStatus;
  origin: InterviewQuestionOrigin;
  difficulty: InterviewDifficulty;
  prompt: string;
  code: string;
  /** Dạng chọn đáp án; dạng sắp xếp log để rỗng */
  options: InterviewOptionModelProps[];
  /** Dạng sắp xếp log: các dòng log theo đúng thứ tự in ra */
  logItems: string[];
  explanation: string;
  /** 2–3 ý chính học viên tự đối chiếu sau khi nộp */
  keyPoints: string[];
  sources: InterviewSourceModelProps[];
  version: string;
  tags: string[];
  /** Trang tài liệu AI đã đọc để ra câu này, dùng lại khi "Tạo lại câu này" */
  sourcePages: string[];
  createdBy: Schema.Types.ObjectId;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewAttemptModelProps extends Document {
  user: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  /** Dạng chọn đáp án: id đáp án đã chọn */
  selectedOptionId?: string;
  /** Dạng sắp xếp log: vị trí các dòng (theo logItems) theo thứ tự học viên chọn */
  logOrder?: number[];
  isCorrect: boolean;
  /** Lượt đầu tiên của người này với câu này, chỉ lượt này được tính điểm */
  isFirstAttempt: boolean;
  points: number;
  explanationText: string;
  /** Vị trí các ý chính học viên tự tick, không tính điểm */
  coveredKeyPoints: number[];
  createdAt: Date;
}

/** Một lựa chọn có giá trị và nhãn: tab, ô chọn dạng bài, độ khó */
export interface InterviewChoiceOption<TValue extends string> {
  value: TValue;
  label: string;
}

export interface InterviewSourceDomain {
  host: string;
  label: string;
}

/* ===== Học viên ===== */

export interface InterviewCourseSummary {
  id: string;
  title: string;
  slug: string;
  image: string;
  totalQuestions: number;
  /** Số câu đã nộp ít nhất một lần */
  answeredCount: number;
  /** Số câu đã nộp mà chưa lần nào đúng */
  wrongCount: number;
  points: number;
  lastPracticedAt?: string;
}

export type InterviewQuestionProgress = "todo" | "correct" | "wrong";

export interface InterviewPracticeOption {
  id: string;
  text: string;
}

export interface InterviewPracticeLogItem {
  /** Vị trí của dòng trong logItems gốc, gửi lên server khi nộp */
  index: number;
  text: string;
}

/** Câu hỏi gửi xuống client lúc làm bài: không có đáp án, không có giải thích */
export interface InterviewPracticeQuestion {
  id: string;
  type: InterviewQuestionType;
  difficulty: InterviewDifficulty;
  prompt: string;
  code: string;
  version: string;
  tags: string[];
  /** Đã trộn theo người học, tải lại vẫn giữ thứ tự */
  options: InterviewPracticeOption[];
  /** Đã trộn theo người học */
  logItems: InterviewPracticeLogItem[];
  progress: InterviewQuestionProgress;
}

export interface InterviewSessionData {
  course: {
    id: string;
    title: string;
    slug: string;
  };
  questions: InterviewPracticeQuestion[];
  points: number;
}

export interface SubmitInterviewAnswerInput {
  questionId: string;
  selectedOptionId?: string;
  logOrder?: number[];
  explanationText: string;
}

export interface InterviewAnswerFeedback {
  attemptId: string;
  isCorrect: boolean;
  isFirstAttempt: boolean;
  pointsAwarded: number;
  correctOptionId?: string;
  /** Dạng sắp xếp log: các dòng theo đúng thứ tự */
  correctLogItems?: string[];
  explanation: string;
  keyPoints: string[];
  sources: InterviewSourceLink[];
  version: string;
}

export interface InterviewSourceLink {
  url: string;
  title: string;
}

export interface SubmitInterviewAnswerResult {
  isSuccess: boolean;
  message?: string;
  feedback?: InterviewAnswerFeedback;
}

/** Hàm nộp bài: mặc định là server action, trang xem trước truyền hàm chấm tại chỗ */
export type SubmitInterviewAnswerHandler = (
  input: SubmitInterviewAnswerInput,
) => Promise<SubmitInterviewAnswerResult>;

export interface SaveInterviewKeyPointsInput {
  attemptId: string;
  coveredKeyPoints: number[];
}

export interface SaveInterviewKeyPointsResult {
  isSuccess: boolean;
}

/* ===== Admin ===== */

export type InterviewManageTab = InterviewQuestionStatus | "all";

export interface InterviewOptionValues {
  text: string;
  isCorrect: boolean;
}

export interface InterviewSourceValues {
  url: string;
  title: string;
  quote: string;
}

export interface InterviewQuestionFormValues {
  courseId: string;
  type: InterviewQuestionType;
  difficulty: InterviewDifficulty;
  version: string;
  prompt: string;
  code: string;
  options: InterviewOptionValues[];
  logItems: string[];
  explanation: string;
  keyPoints: string[];
  sources: InterviewSourceValues[];
  tags: string[];
}

export interface InterviewAdminSource extends InterviewSourceValues {
  isQuoteVerified: boolean;
}

/** Một câu hỏi đầy đủ cho trang Admin */
/** Kết quả học viên làm một câu, chỉ tính lượt đầu của mỗi người */
export interface InterviewQuestionStats {
  learnerCount: number;
  correctCount: number;
}

export interface InterviewAdminQuestion {
  id: string;
  courseId: string;
  type: InterviewQuestionType;
  status: InterviewQuestionStatus;
  origin: InterviewQuestionOrigin;
  difficulty: InterviewDifficulty;
  version: string;
  prompt: string;
  code: string;
  options: InterviewOptionValues[];
  logItems: string[];
  explanation: string;
  keyPoints: string[];
  sources: InterviewAdminSource[];
  tags: string[];
  sourcePages: string[];
  createdAt: string;
  /** Đổi sau mỗi lần lưu, tạo lại: dùng làm key để form nạp lại nội dung mới */
  updatedAt: string;
  stats: InterviewQuestionStats;
}

export interface FetchInterviewQuestionsParams {
  courseId: string;
  tab: string;
  search: string;
}

export interface InterviewTabCounts {
  draft: number;
  published: number;
  all: number;
}

export interface FetchInterviewQuestionsResult {
  questions: InterviewAdminQuestion[];
  tabCounts: InterviewTabCounts;
}

export interface InterviewManageFilters {
  courseId: string;
  tab: InterviewManageTab;
  search: string;
}

export interface SaveInterviewQuestionInput {
  /** Bỏ trống là tạo câu mới */
  questionId?: string;
  values: InterviewQuestionFormValues;
  /** Lưu xong thì đăng luôn */
  shouldPublish: boolean;
}

export interface SaveInterviewQuestionResult {
  isSuccess: boolean;
  message?: string;
  question?: InterviewAdminQuestion;
}

export interface InterviewActionResult {
  isSuccess: boolean;
  message?: string;
}

export interface GenerateInterviewQuestionsInput {
  courseId: string;
  topics: string[];
  types: InterviewQuestionType[];
  count: number;
  pageUrls: string[];
  hint: string;
}

export interface GenerateInterviewQuestionsResult {
  isSuccess: boolean;
  message?: string;
  createdCount?: number;
  /** Câu AI trả về mà không qua kiểm tra (sai cấu trúc, nguồn ngoài danh sách) */
  skippedCount?: number;
}

export interface RegenerateInterviewQuestionResult {
  isSuccess: boolean;
  message?: string;
  question?: InterviewAdminQuestion;
}

/** Một câu AI trả về, trước khi kiểm tra */
export interface InterviewGeneratedQuestion {
  type: InterviewQuestionType;
  difficulty: InterviewDifficulty;
  prompt: string;
  code: string;
  options: InterviewOptionValues[];
  logItems: string[];
  explanation: string;
  keyPoints: string[];
  sources: InterviewSourceValues[];
  version: string;
  tags: string[];
}

/** Trang tài liệu đã tải về, chữ đã lọc thẻ HTML */
export interface InterviewDocPage {
  url: string;
  title: string;
  text: string;
}
