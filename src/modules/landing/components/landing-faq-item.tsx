import { Plus } from "lucide-react";
import { FaqItem } from "../types";

interface LandingFaqItemProps {
  faqItem: FaqItem;
}

/** Một câu hỏi mở đóng tại chỗ bằng details, không cần JavaScript */
export function LandingFaqItem({ faqItem }: LandingFaqItemProps) {
  return (
    <details className="group border-b border-border py-5 first:pt-0">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {faqItem.question}
        <Plus className="mt-0.5 size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" />
      </summary>
      <p className="mt-3 max-w-[65ch] text-pretty text-sm leading-6 text-muted">
        {faqItem.answer}
      </p>
    </details>
  );
}
