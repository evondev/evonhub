"use client";

import { Button } from "@/components/ui/button";
import { useQueryCommentsByLesson } from "@/modules/comment/services";
import { lessonTabs } from "@/modules/lesson/constants";
import { LessonTabItem, LessonTabValue } from "@/modules/lesson/types";
import { useMediaQuery } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import dynamic from "next/dynamic";
import { useState } from "react";
import { LessonNotes } from "./lesson-notes";
import { LessonOutline } from "./outline";

// Tab bình luận mở thì mới tải form bình luận (react-hook-form, zod, editor)
const Comment = dynamic(() =>
  import("@/shared/features/comment").then(
    (commentModule) => commentModule.Comment,
  ),
);

export interface LessonTabsProps {
  lessonId: string;
  notesHtml?: string;
}

function getTabClassName(tab: LessonTabItem, isSelected: boolean) {
  return cn(
    "relative box-content h-10 shrink-0 gap-1.5 rounded-xl px-2 pb-px hover:bg-transparent",
    "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full",
    tab.isMobileOnly && "lg:hidden",
    isSelected && "text-foreground after:bg-foreground hover:text-foreground",
    !isSelected && "text-foreground/70 after:bg-transparent hover:text-foreground",
  );
}

// Dưới video: Mục lục (chỉ màn hẹp, vì từ lg đã có cột phải), Ghi chú (bài có
// ghi chú mới có), Bình luận. Mặc định màn hẹp mở Mục lục, màn rộng mở Ghi chú.
export function LessonTabs({ lessonId, notesHtml }: LessonTabsProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedTab, setSelectedTab] = useState<LessonTabValue | null>(null);
  const { data: comments } = useQueryCommentsByLesson({ lessonId });
  const commentCount = comments?.length ?? 0;
  const hasNotes = !!notesHtml;

  const visibleTabs = lessonTabs.filter(
    (tab) => tab.value !== "notes" || hasNotes,
  );
  const defaultTab: LessonTabValue = hasNotes ? "notes" : "comments";
  const isOutlineTabHidden = selectedTab === "outline" && isDesktop;
  let activeTab = selectedTab ?? (isDesktop ? defaultTab : "outline");
  if (isOutlineTabHidden) activeTab = defaultTab;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keyboardTabs = visibleTabs.filter(
      (tab) => !tab.isMobileOnly || !isDesktop,
    );
    const currentIndex = keyboardTabs.findIndex(
      (tab) => tab.value === activeTab,
    );
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = currentIndex + 1;
    if (event.key === "ArrowLeft") nextIndex = currentIndex - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = keyboardTabs.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextTab =
      keyboardTabs[(nextIndex + keyboardTabs.length) % keyboardTabs.length];
    setSelectedTab(nextTab.value);
    document.getElementById(`lesson-tab-${nextTab.value}`)?.focus();
  };

  return (
    <div>
      <div className="px-2 lg:px-0">
        <div className="scroll-hidden overflow-x-auto">
          <div
            role="tablist"
            aria-label="Nội dung bài"
            onKeyDown={handleKeyDown}
            className="flex min-w-full gap-2 px-2 shadow-[inset_0_-1px_0_var(--border-strong)] lg:px-0"
          >
            {visibleTabs.map((tab) => {
              const isSelected = tab.value === activeTab;
              const count = tab.value === "comments" ? commentCount : 0;

              return (
                <Button
                  key={tab.value}
                  id={`lesson-tab-${tab.value}`}
                  type="button"
                  variant="ghost"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls="lesson-tab-panel"
                  tabIndex={isSelected ? 0 : -1}
                  className={getTabClassName(tab, isSelected)}
                  onClick={() => setSelectedTab(tab.value)}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className="text-xs font-normal tabular-nums text-foreground/70">
                      {count}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id="lesson-tab-panel"
        role="tabpanel"
        aria-labelledby={`lesson-tab-${activeTab}`}
        className="mt-4 px-4 lg:px-0"
      >
        {activeTab === "outline" && (
          <div className="lg:hidden">
            <LessonOutline lessonId={lessonId} variant="tab" />
          </div>
        )}
        {activeTab === "notes" && notesHtml && <LessonNotes html={notesHtml} />}
        {activeTab === "comments" && <Comment lessonId={lessonId} />}
      </div>
    </div>
  );
}
