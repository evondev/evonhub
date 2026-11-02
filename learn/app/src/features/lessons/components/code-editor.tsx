"use client";

import { useMemo } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { FileCode2 } from "lucide-react";
import type { CodeLanguage } from "../types/lesson";
import { editorHighlighting } from "../utils/editor-highlight-style";

interface CodeEditorProps {
  fileName: string;
  language: CodeLanguage;
  value: string;
  onChange: (nextValue: string) => void;
}

export default function CodeEditor({ fileName, language, value, onChange }: CodeEditorProps) {
  // Xuống dòng thay vì cuộn ngang: ở bàn làm việc hẹp, dòng dài bị giấu thì người học không thấy mình đang sửa gì.
  const editorExtensions = useMemo(
    () => [javascript({ typescript: language === "typescript" }), EditorView.lineWrapping, editorHighlighting],
    [language],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border-strong bg-surface">
      <div className="flex items-center gap-2 border-b border-border-strong px-4 py-2 text-xs text-muted">
        <FileCode2 className="size-3.5 shrink-0" aria-hidden />
        <span className="font-mono">{fileName}</span>
        <span className="ml-auto">Sửa trực tiếp</span>
      </div>
      <CodeMirror
        value={value}
        onChange={onChange}
        extensions={editorExtensions}
        theme="light"
        basicSetup={{ foldGutter: false, autocompletion: false, highlightActiveLineGutter: false }}
        className="py-2"
      />
    </div>
  );
}
