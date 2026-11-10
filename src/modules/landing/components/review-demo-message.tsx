import { cn } from "@/shared/utils";
import { reviewDemoMessages } from "../constants/review-demo.constants";
import { ReviewDemoPhase } from "../types";

interface ReviewDemoMessageProps {
  phase: ReviewDemoPhase;
}

/** Ô thông điệp dưới editor; cao cố định để đổi nhịp không làm editor nhảy */
export function ReviewDemoMessage({ phase }: ReviewDemoMessageProps) {
  const message = reviewDemoMessages[phase];
  const MessageIcon = message.icon;

  return (
    <div
      aria-live="polite"
      className="flex min-h-[4.5rem] items-start gap-2.5 rounded-xl bg-white/[0.06] px-3.5 py-3 font-sans text-sm leading-6 ring-1 ring-inset ring-white/10"
    >
      <MessageIcon
        className={cn(
          "mt-1 size-4 shrink-0",
          message.className,
          phase === "typing" && "animate-spin motion-reduce:animate-none",
        )}
      />
      <p className="text-gray-300">
        <b className={cn("font-semibold", message.className)}>
          {message.title}
        </b>{" "}
        {message.text}
      </p>
    </div>
  );
}
