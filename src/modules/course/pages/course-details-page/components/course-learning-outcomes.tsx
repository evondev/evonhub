import { Check } from "lucide-react";

export interface CourseLearningOutcomesProps {
  items: string[];
}

export default function CourseLearningOutcomes({
  items,
}: CourseLearningOutcomesProps) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <h2 className="mb-3 text-base font-semibold text-foreground">
        Bạn sẽ học được
      </h2>
      <ul className="flex flex-col gap-2.5 text-sm/6 text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <Check
              className="mt-1 size-4 shrink-0 text-primary-strong"
              aria-hidden
            />
            <span className="text-pretty">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
