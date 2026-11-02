import "server-only";
import path from "node:path";
import { acceptanceSuiteConfigs } from "../constants/acceptance-suite-configs";
import type { LessonStep } from "../types/lesson";
import { resolveWorkspaceDir } from "./lab-paths";

// Link vscode://file/<đường dẫn tuyệt đối>:<dòng> mở file đúng dòng trong VS Code.
// Đường dẫn tuyệt đối chỉ server biết, nên điền lúc render thay vì khai trong constants.
export function attachEditorUrls(steps: LessonStep[]): LessonStep[] {
  return steps.map((step) => {
    if (step.kind !== "acceptance") return step;

    const projectDir = resolveWorkspaceDir(acceptanceSuiteConfigs[step.suiteId].workspace);
    const todoFiles = step.todoFiles.map((todoFile) => ({
      ...todoFile,
      editorUrl: `vscode://file${encodeURI(path.join(projectDir, todoFile.path))}:${todoFile.line}`,
    }));

    return { ...step, todoFiles };
  });
}
