import type { CourseQaItem } from "@/modules/course/types";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import CourseSection from "./course-section";

export interface CourseQaProps {
  items: CourseQaItem[];
}

export default function CourseQa({ items }: CourseQaProps) {
  if (items.length === 0) return null;

  return (
    <CourseSection title="Hỏi đáp">
      <AccordionPrimitive.Root
        type="multiple"
        className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface"
      >
        {items.map((item) => (
          <AccordionPrimitive.Item key={item.question} value={item.question}>
            <AccordionPrimitive.Header asChild>
              <h3>
                <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium text-pretty text-foreground outline-none sm:px-5">
                  {item.question}
                  <ChevronDown
                    className="size-4 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180 motion-reduce:transition-none"
                    aria-hidden
                  />
                </AccordionPrimitive.Trigger>
              </h3>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
              <div className="text-pretty px-4 pb-4 text-sm/6 text-muted sm:px-5">
                {item.answer}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </CourseSection>
  );
}
