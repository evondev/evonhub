import { Button } from "@/components/ui/button";
import { chatConversationStarters } from "../../../constants";

interface ChatConversationStartersProps {
  onSelect: (content: string) => void;
}

/** Phòng hôm nay chưa ai nói gì: bấm một câu là gửi luôn */
export function ChatConversationStarters({
  onSelect,
}: ChatConversationStartersProps) {
  return (
    <div className="mb-3 space-y-2">
      <p className="text-sm text-muted">Mở lời</p>
      <div className="flex flex-wrap gap-2">
        {chatConversationStarters.map((starter) => (
          <Button
            key={starter}
            type="button"
            variant="outline"
            onClick={() => onSelect(starter)}
            className="h-auto w-fit max-w-full justify-start px-3 py-2 text-left font-normal"
          >
            {starter}
          </Button>
        ))}
      </div>
    </div>
  );
}
