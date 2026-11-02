"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/button";
import { cn } from "@/utils/cn";
import type { RoadmapItem, RoadmapStageGroup } from "../types/roadmap";
import RoadmapDetail from "./roadmap-detail";

interface RoadmapExplorerProps {
  stageGroups: RoadmapStageGroup[];
  belowList: ReactNode;
  belowDetail: ReactNode;
}

function getItemClasses(isSelected: boolean, item: RoadmapItem) {
  return cn(
    "flex min-h-0 w-full items-center justify-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-normal",
    isSelected && "bg-secondary font-medium text-foreground hover:bg-secondary hover:text-foreground",
    // Mốc đang làm nổi lên (P12): nền tím nhạt, khác nền của mục đang chọn.
    !isSelected && item.status === "dang-lam" && "bg-primary-light text-foreground hover:bg-primary/12 hover:text-foreground",
    !isSelected && item.status === "chua-viet" && "text-muted hover:bg-item-hover hover:text-foreground",
    !isSelected && item.status !== "chua-viet" && item.status !== "dang-lam" && "text-foreground hover:bg-item-hover hover:text-foreground",
  );
}

// Lộ trình kiểu danh sách + chi tiết: chọn mốc bên trái, thấy TODO, test, bài lab bên phải.
export default function RoadmapExplorer({ stageGroups, belowList, belowDetail }: RoadmapExplorerProps) {
  const allItems = stageGroups.flatMap((stageGroup) => stageGroup.items);
  const currentItem = allItems.find((item) => item.status === "dang-lam") ?? allItems[0];
  const [selectedNumber, setSelectedNumber] = useState(currentItem.number);
  const detailRef = useRef<HTMLDivElement>(null);
  const selectedItem = allItems.find((item) => item.number === selectedNumber) ?? currentItem;

  function handleSelect(itemNumber: number) {
    setSelectedNumber(itemNumber);

    // Màn hẹp: chi tiết nằm trên danh sách, cuộn lên cho thấy.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="order-2 space-y-6 lg:order-1">
        {stageGroups.map((stageGroup) => (
          <section key={stageGroup.stage} className="space-y-2">
            <h2 className="px-3 text-xs font-medium text-muted">{stageGroup.stage}</h2>
            {/* Danh sách nằm trong card trắng: chữ thẳng trên nền xám thì mục chưa chọn trông như bị khoá. */}
            <ul className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-1.5">
              {stageGroup.items.map((item) => (
                <li key={item.number}>
                  <Button
                    variant="ghost"
                    aria-current={item.number === selectedItem.number ? "true" : undefined}
                    onClick={() => handleSelect(item.number)}
                    className={getItemClasses(item.number === selectedItem.number, item)}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                        item.status === "dang-lam" && "bg-primary text-primary-foreground",
                        item.status !== "dang-lam" && item.number === selectedItem.number && "bg-surface",
                        item.status !== "dang-lam" && item.number !== selectedItem.number && "bg-background",
                      )}
                    >
                      {item.number}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item.title}</span>
                    {item.checkCount !== undefined && (
                      <span className="shrink-0 text-xs font-normal text-muted">
                        {item.passedCount}/{item.checkCount}
                      </span>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {belowList}
      </div>
      <div ref={detailRef} className="order-1 scroll-mt-20 space-y-4 lg:sticky lg:top-6 lg:order-2 lg:self-start">
        <RoadmapDetail item={selectedItem} />
        {belowDetail}
      </div>
    </div>
  );
}
