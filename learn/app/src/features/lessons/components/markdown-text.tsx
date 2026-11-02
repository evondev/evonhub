import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/utils/cn";

interface MarkdownTextProps {
  content: string;
  className?: string;
  // Chữ nằm trong nút thì không được có thẻ khối (p, div): render thành span.
  isInline?: boolean;
}

const blockComponents: Components = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5">{children}</ul>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  // Lệnh, đường dẫn dài không có chỗ ngắt: cho ngắt bất kỳ đâu, không thì đẩy trang tràn ngang ở màn hẹp.
  code: ({ children }) => (
    <code className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-[0.9em] text-foreground [overflow-wrap:anywhere]">
      {children}
    </code>
  ),
  // Khối code (cây thư mục, lệnh nhiều dòng) giữ nguyên dòng, cuộn ngang trong khung; code bên trong bỏ nền inline.
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-border-strong bg-surface px-4 py-3 font-mono text-xs leading-[1.35] [&>code]:bg-transparent [&>code]:p-0 [&>code]:[overflow-wrap:normal]">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-xl border border-border-strong bg-surface">
      <table className="w-full min-w-xl border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-border-strong bg-surface-hover px-4 py-2.5 text-xs font-medium text-muted">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-border px-4 py-3 align-top">{children}</td>,
};

const inlineComponents: Components = {
  ...blockComponents,
  p: ({ children }) => <span className="leading-relaxed">{children}</span>,
};

export default function MarkdownText({ content, className, isInline = false }: MarkdownTextProps) {
  const WrapperTag = isInline ? "span" : "div";

  return (
    <WrapperTag className={cn(!isInline && "space-y-3", "text-sm text-pretty text-foreground", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={isInline ? inlineComponents : blockComponents}>
        {content}
      </ReactMarkdown>
    </WrapperTag>
  );
}
