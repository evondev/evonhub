"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import { Check, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { MyOrdersHistoryFilter, MyOrdersHistoryTab } from "../../../types";

interface OrderHistoryTabsProps {
  tabs: MyOrdersHistoryTab[];
  activeFilter: MyOrdersHistoryFilter;
  onChange: (filter: MyOrdersHistoryFilter) => void;
  /** id của danh sách mà tab đang lọc */
  controlsId: string;
}

const navigationKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];

export function OrderHistoryTabs({
  tabs,
  activeFilter,
  onChange,
  controlsId,
}: OrderHistoryTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = Math.max(
    tabs.findIndex((tab) => tab.filter === activeFilter),
    0,
  );
  const activeTab = tabs[activeIndex];

  // Bàn phím theo WAI-ARIA: mũi tên chuyển và chọn luôn, Home/End về hai đầu
  function handleTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!navigationKeys.includes(event.key)) return;

    event.preventDefault();

    const lastIndex = tabs.length - 1;
    const nextIndexByKey: Record<string, number> = {
      ArrowLeft: activeIndex === 0 ? lastIndex : activeIndex - 1,
      ArrowRight: activeIndex === lastIndex ? 0 : activeIndex + 1,
      Home: 0,
      End: lastIndex,
    };
    const nextIndex = nextIndexByKey[event.key];

    onChange(tabs[nextIndex].filter);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Lọc theo trạng thái"
        onKeyDown={handleTabKeyDown}
        className="hidden items-center gap-1 sm:flex"
      >
        {tabs.map((tab, index) => {
          const isSelected = index === activeIndex;

          return (
            <Button
              key={tab.filter}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              variant="ghost"
              role="tab"
              aria-selected={isSelected}
              aria-controls={controlsId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onChange(tab.filter)}
              className={cn(
                "h-9 gap-1.5 rounded-lg border px-3 font-medium",
                isSelected &&
                  "border-transparent bg-item-active text-foreground hover:bg-item-active hover:text-foreground",
                !isSelected &&
                  "border-transparent text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
              )}
            >
              {tab.label}
              <span className="text-xs font-normal tabular-nums text-foreground/70">
                {tab.count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Dưới sm bốn tab không vừa một hàng: thành nút chọn có nhãn "Trạng thái:" */}
      <div className="sm:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-fit gap-1.5 px-3 hover:bg-surface data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/15"
            >
              <span className="text-muted">Trạng thái:</span>
              <span className="font-medium text-foreground">
                {activeTab.label} · {activeTab.count}
              </span>
              <ChevronDown className="size-4 text-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="flex w-52 flex-col gap-0.5 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
          >
            {tabs.map((tab, index) => {
              const isSelected = index === activeIndex;

              return (
                <DropdownMenuItem
                  key={tab.filter}
                  onSelect={() => onChange(tab.filter)}
                  className={cn(
                    "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm focus:text-foreground dark:focus:text-foreground",
                    isSelected &&
                      "bg-item-active font-medium text-foreground focus:bg-item-active dark:focus:bg-item-active",
                    !isSelected &&
                      "text-foreground/80 focus:bg-item-hover dark:focus:bg-item-hover",
                  )}
                >
                  <span className="flex-1">{tab.label}</span>
                  <span className="text-xs font-normal tabular-nums text-foreground/70">
                    {tab.count}
                  </span>
                  <Check
                    aria-hidden
                    className={cn("size-4", !isSelected && "invisible")}
                  />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
