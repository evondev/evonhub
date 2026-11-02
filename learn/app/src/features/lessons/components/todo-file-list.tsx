import { ExternalLink, FileCode2 } from "lucide-react";
import type { TodoFile } from "../types/lesson";
import MarkdownText from "./markdown-text";

interface TodoFileListProps {
  todoFiles: TodoFile[];
  // Trên bàn làm việc chỉ cần tên file để bấm mở; việc cần viết đã nằm ở đề bài bên trái.
  isCompact?: boolean;
}

export default function TodoFileList({ todoFiles, isCompact = false }: TodoFileListProps) {
  if (isCompact) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted">{todoFiles.length} chỗ TODO · bấm để mở trong VS Code</p>
        <ul className="flex flex-col gap-1">
          {todoFiles.map((todoFile) => (
            <li key={todoFile.path}>
              <a
                href={todoFile.editorUrl}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-mono text-xs transition-colors hover:bg-item-hover"
              >
                <FileCode2 className="size-3.5 shrink-0 text-muted" aria-hidden />
                <span className="truncate">
                  {todoFile.path.replace(/^src\//, "")}
                  <span className="text-muted">:{todoFile.line}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ol className="divide-y divide-border overflow-hidden rounded-xl border border-border-strong bg-surface">
      {todoFiles.map((todoFile) => (
        <li key={todoFile.path} className="flex flex-wrap items-start gap-3 px-4 py-3 sm:flex-nowrap">
          <FileCode2 className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-mono text-xs break-all">
              api/{todoFile.path}
              <span className="text-muted">:{todoFile.line}</span>
            </p>
            <MarkdownText content={todoFile.task} className="text-muted" />
          </div>
          {todoFile.editorUrl && (
            <a
              href={todoFile.editorUrl}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted transition-colors hover:bg-item-hover hover:text-foreground"
            >
              Mở trong VS Code
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
