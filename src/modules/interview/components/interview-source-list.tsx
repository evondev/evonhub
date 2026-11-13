import { ArrowUpRight } from "lucide-react";
import { InterviewSourceLink } from "../types";

interface InterviewSourceListProps {
  sources: InterviewSourceLink[];
  version: string;
}

function getSourceLabel(source: InterviewSourceLink) {
  const host = new URL(source.url).hostname.replace(/^www\./, "");

  return source.title ? `${host} · ${source.title}` : host;
}

/** Link tài liệu chính chủ dưới phần giải thích */
export function InterviewSourceList({ sources, version }: InterviewSourceListProps) {
  if (!sources.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border pt-4 text-sm">
      <span className="text-muted">Nguồn:</span>
      {sources.map((source) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary-strong underline-offset-4 hover:underline"
        >
          {getSourceLabel(source)}
          <ArrowUpRight className="size-3.5 shrink-0" />
        </a>
      ))}
      {version && <span className="text-xs text-muted">· {version}</span>}
    </div>
  );
}
