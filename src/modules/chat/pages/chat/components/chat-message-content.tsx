import { cn } from "@/shared/utils";
import { ChatMessageSegment } from "../../../types";

interface ChatMessageContentProps {
  segments: ChatMessageSegment[];
  /** Bong bóng tin của mình nền màu nhấn: link đổi sang chữ trắng gạch chân */
  isOnPrimary: boolean;
}

/** Nội dung tin: chữ giữ nguyên xuống dòng, link mở tab mới. Không render HTML */
export function ChatMessageContent({
  segments,
  isOnPrimary,
}: ChatMessageContentProps) {
  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "link") {
          return (
            <a
              key={index}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className={cn(
                "underline underline-offset-2 [overflow-wrap:anywhere]",
                isOnPrimary && "decoration-primary-foreground/50",
                !isOnPrimary &&
                  "text-primary-strong decoration-primary/30 hover:decoration-primary",
              )}
            >
              {segment.value}
            </a>
          );
        }

        return <span key={index}>{segment.value}</span>;
      })}
    </>
  );
}
