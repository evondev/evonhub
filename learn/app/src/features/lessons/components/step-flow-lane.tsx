"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/cn";
import type { StepFlowLane as StepFlowLaneData } from "../types/lesson";

interface StepFlowLaneProps {
  lane: StepFlowLaneData;
  items: string[];
  focusItem?: string;
}

export default function StepFlowLane({ lane, items, focusItem }: StepFlowLaneProps) {
  return (
    <div className="flex min-h-32 flex-col gap-2 rounded-xl bg-background p-3">
      <span className="text-xs font-medium text-muted">{lane.title}</span>
      <ul className="flex flex-col gap-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.li
              key={item}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors",
                item === focusItem && "border-primary bg-primary text-primary-foreground",
                item !== focusItem && "border-border-strong bg-surface text-foreground",
              )}
            >
              {item}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
