export interface TaskCheck {
  label: string;
  isPassed: boolean;
  detail?: string;
}

export interface TaskRunResult {
  isPassed: boolean;
  checks: TaskCheck[];
  output: string;
  durationMs: number;
}

// Tham số truyền cho node.
export interface NodeRunConfig {
  workspace: string;
  buildArgs?: string[];
  runArgs: string[];
  timeoutMs: number;
}

// Bài thực hành: chép template vào .runs/<taskId>, args tính từ thư mục đó.
export interface TaskRunConfig extends NodeRunConfig {
  template: string;
  targetFile: string;
}

// Test chấp nhận của mốc: chạy thẳng trong thư mục project, args tính từ đó.
export interface AcceptanceSuiteConfig extends NodeRunConfig {
  // Xoá trước mỗi lần build, để file bro đã xoá không còn bản .js cũ nằm lại.
  outDir: string;
}
