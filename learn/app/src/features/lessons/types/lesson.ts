export type CodeLanguage = "javascript" | "typescript";

export interface CodeSnippet {
  fileName: string;
  language: CodeLanguage;
  source: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  explanation: string;
  isCorrect: boolean;
}

export interface ChoiceQuestion {
  prompt: string;
  options: ChoiceOption[];
}

export interface StepFlowLane {
  id: string;
  title: string;
}

export interface StepFlowFrame {
  caption: string;
  lanes: Record<string, string[]>;
  focusItem?: string;
  activeLines?: number[];
  question?: ChoiceQuestion;
}

interface LessonStepBase {
  id: string;
  title: string;
}

export interface ProseStep extends LessonStepBase {
  kind: "prose";
  body: string;
}

export interface PredictStep extends LessonStepBase {
  kind: "predict";
  intro?: string;
  code?: CodeSnippet;
  question: ChoiceQuestion;
}

export interface StepFlowStep extends LessonStepBase {
  kind: "step-flow";
  intro?: string;
  code?: CodeSnippet;
  lanes: StepFlowLane[];
  frames: StepFlowFrame[];
}

export interface SpotBugStep extends LessonStepBase {
  kind: "spot-bug";
  prompt: string;
  code: CodeSnippet;
  bugLines: number[];
  lineNotes: Record<number, string>;
  summary: string;
}

export interface CodeTaskStep extends LessonStepBase {
  kind: "code-task";
  taskId: string;
  prompt: string;
  code: CodeSnippet;
  isEditable: boolean;
  hints: string[];
  afterPass?: string;
}

export interface ExplainBackStep extends LessonStepBase {
  kind: "explain-back";
  prompt: string;
  keyPoints: string[];
}

// File trong project mà người học tự viết, mở thẳng trong VS Code.
export interface TodoFile {
  path: string;
  line: number;
  task: string;
  // Server điền lúc render (cần đường dẫn tuyệt đối trên máy), constants không khai.
  editorUrl?: string;
}

// Chạy test chấp nhận của project lớn dần (api/ của repo), không chép template.
export interface AcceptanceStep extends LessonStepBase {
  kind: "acceptance";
  suiteId: string;
  prompt: string;
  todoFiles: TodoFile[];
  hints: string[];
  afterPass?: string;
}

export interface LessonLink {
  slug: string;
  number: number;
  title: string;
  summary: string;
  minutes: number;
}

// Mốc trỏ sang bài lab mở ra đúng lúc vấp.
export interface LabLinkStep extends LessonStepBase {
  kind: "lab-link";
  prompt: string;
  lesson: LessonLink;
}

export type LessonStep =
  | ProseStep
  | PredictStep
  | StepFlowStep
  | SpotBugStep
  | CodeTaskStep
  | ExplainBackStep
  | AcceptanceStep
  | LabLinkStep;

export type LessonStepKind = LessonStep["kind"];

// Bài và mốc đều là một chuỗi bước: cùng cách render, cùng cách lưu tiến độ.
export interface StepContainer {
  slug: string;
  title: string;
  steps: LessonStep[];
}

export interface Lesson extends StepContainer {
  number: number;
  stage: string;
  summary: string;
  minutes: number;
}
