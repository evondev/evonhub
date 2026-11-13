import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToneBadge } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { Plus, X } from "lucide-react";
import { INTERVIEW_SOURCE_LIMIT, INTERVIEW_TEXT_LIMITS } from "../../../constants";
import { InterviewAdminSource, InterviewSourceValues } from "../../../types";
import { removeItemAt, replaceItemAt } from "../../../utils";

interface EditorSourcesProps {
  sources: InterviewSourceValues[];
  /** Kết quả kiểm đoạn trích của lần lưu gần nhất, theo đúng thứ tự nguồn đã lưu */
  savedSources: InterviewAdminSource[];
  onChange: (sources: InterviewSourceValues[]) => void;
}

function findSavedSource(source: InterviewSourceValues, savedSources: InterviewAdminSource[]) {
  return savedSources.find(
    (savedSource) => savedSource.url === source.url.trim() && savedSource.quote === source.quote.trim(),
  );
}

/** Nguồn chính chủ: link, đoạn trích, kết quả kiểm đoạn trích có thật trong trang không */
export function EditorSources({ sources, savedSources, onChange }: EditorSourcesProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-pretty text-sm font-medium text-foreground">
        Nguồn<span className="text-red-600"> *</span>{" "}
        <span className="font-normal text-muted">· react.dev, nextjs.org, developer.mozilla.org, typescriptlang.org</span>
      </legend>
      <div className="flex flex-col gap-2">
        {sources.map((source, index) => {
          const savedSource = findSavedSource(source, savedSources);
          const isUnverified = Boolean(savedSource && source.quote && !savedSource.isQuoteVerified);

          return (
            // Nguồn chưa có id, chỉ thêm cuối hoặc xoá nên key theo vị trí
            <div
              key={index}
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-3",
                isUnverified && "border-red-200 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10",
                !isUnverified && "border-border-strong",
              )}
            >
              <div className="flex items-center gap-2">
                <Input
                  value={source.url}
                  aria-label={`Link nguồn ${index + 1}`}
                  placeholder="https://react.dev/learn/…"
                  className="font-normal"
                  onChange={(event) => onChange(replaceItemAt(sources, index, { ...source, url: event.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  aria-label={`Bỏ nguồn ${index + 1}`}
                  disabled={sources.length <= 1}
                  onClick={() => onChange(removeItemAt(sources, index))}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <Textarea
                rows={2}
                value={source.quote}
                maxLength={INTERVIEW_TEXT_LIMITS.quote}
                aria-label={`Đoạn trích nguồn ${index + 1}`}
                placeholder="Câu chép nguyên văn từ trang, làm căn cứ cho đáp án"
                className="min-h-0 resize-y font-normal italic !leading-6"
                onChange={(event) => onChange(replaceItemAt(sources, index, { ...source, quote: event.target.value }))}
              />
              {savedSource && source.quote && (
                <div className="flex flex-wrap items-center gap-2">
                  <ToneBadge
                    tone={savedSource.isQuoteVerified ? "success" : "error"}
                    label={savedSource.isQuoteVerified ? "Trích dẫn khớp" : "Không thấy trong trang"}
                  />
                  {isUnverified && (
                    <span className="text-pretty text-xs text-red-700 dark:text-red-400">
                      Không tìm thấy đoạn này trong trang. Sửa lại đoạn trích hoặc bỏ nguồn này.
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {sources.length < INTERVIEW_SOURCE_LIMIT && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit"
            onClick={() => onChange([...sources, { url: "", title: "", quote: "" }])}
          >
            <Plus className="size-4" />
            Thêm nguồn
          </Button>
        )}
      </div>
    </fieldset>
  );
}
