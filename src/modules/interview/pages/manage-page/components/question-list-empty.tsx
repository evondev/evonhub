import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Plus, Sparkles } from "lucide-react";

interface QuestionListEmptyProps {
  isSearching: boolean;
  onClearSearch: () => void;
  onCreate: () => void;
  onOpenAi: () => void;
}

export function QuestionListEmpty({ isSearching, onClearSearch, onCreate, onOpenAi }: QuestionListEmptyProps) {
  if (isSearching) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-4 py-12 text-center text-sm text-muted">
        Không có câu nào khớp từ khóa.{" "}
        <Button variant="link" className="inline h-auto p-0 align-baseline font-medium" onClick={onClearSearch}>
          Xoá tìm kiếm
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary-strong">
        <MessageCircleQuestion className="size-6" />
      </span>
      <div>
        <p className="text-base font-semibold text-foreground">Chưa có câu hỏi nào ở đây</p>
        <p className="mx-auto mt-1 max-w-[46ch] text-pretty text-sm text-muted">
          Tạo một lô nháp bằng AI rồi duyệt từng câu, hoặc tự thêm câu đầu tiên.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={onCreate}>
          <Plus className="size-4" />
          Thêm câu
        </Button>
        <Button variant="primary" onClick={onOpenAi}>
          <Sparkles className="size-4" />
          Tạo bằng AI
        </Button>
      </div>
    </div>
  );
}
