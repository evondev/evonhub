interface InterviewCodeBlockProps {
  code: string;
  version: string;
}

/** Khối code đọc được, có số dòng. Dòng dài cuộn ngang trong khối, không kéo cả trang */
export function InterviewCodeBlock({ code, version }: InterviewCodeBlockProps) {
  const lines = code.replace(/\s+$/, "").split("\n");

  return (
    <div className="overflow-hidden rounded-xl bg-zinc-900 dark:bg-black/40">
      {version && (
        <div className="flex h-9 items-center justify-end border-b border-white/10 px-4 text-xs text-zinc-400">
          {version}
        </div>
      )}
      <pre className="scrollbar-auto-hide overflow-x-auto p-4 font-mono text-xs leading-6 text-zinc-100 [font-variant-ligatures:none] sm:text-sm">
        <code className="table">
          {lines.map((line, index) => (
            // Dòng code không có id riêng, thứ tự cố định nên dùng số dòng làm key
            <span key={index} className="table-row">
              <span className="table-cell select-none pr-4 text-right text-zinc-400">
                {index + 1}
              </span>
              <span className="table-cell whitespace-pre">{line}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
