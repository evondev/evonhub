"use client";

import { Button } from "@/components/ui/button";
import { formatThoundsand } from "@/shared/utils";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { LEADERBOARD_VISIBLE_COUNT } from "../../../constants";
import {
  LeaderboardEntry,
  LeaderboardStanding,
  LeaderboardViewer,
} from "../../../types";
import { LeaderboardRow } from "./leaderboard-row";

interface LeaderboardListProps {
  /** Từ hạng 4 trở đi: top 3 đã nằm trên bục */
  entries: LeaderboardEntry[];
  podiumCount: number;
  participantCount: number;
  participantLabel: string;
  viewer: LeaderboardViewer | null;
  standing: LeaderboardStanding | null;
  /** Bậc của bạn, cho dòng nối ở cuối khi bạn ngoài phần đang hiện */
  viewerTierLevel: number;
}

/**
 * Mở ra hiện tới hạng LEADERBOARD_VISIBLE_COUNT, "Xem thêm" hiện đủ top 100.
 * Bạn nằm ngoài phần đang hiện (kể cả ngoài top 100) thì dòng của bạn nối ở
 * cuối sau dấu ⋯, để luôn thấy mình đứng đâu.
 */
export function LeaderboardList({
  entries,
  podiumCount,
  participantCount,
  participantLabel,
  viewer,
  standing,
  viewerTierLevel,
}: LeaderboardListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const collapsedCount = Math.max(0, LEADERBOARD_VISIBLE_COUNT - podiumCount);
  const visibleEntries = isExpanded
    ? entries
    : entries.slice(0, collapsedCount);
  const shownCount = podiumCount + visibleEntries.length;
  const hasMore = visibleEntries.length < entries.length;
  const isViewerVisible = visibleEntries.some(
    (entry) => entry.userId === viewer?.userId,
  );
  // Hạng trong top 3 thì đã nằm trên bục, không nối thêm
  const shouldAppendViewer =
    !!viewer && !!standing && standing.rank > podiumCount && !isViewerVisible;

  function handleShowMore() {
    setIsExpanded(true);
  }

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-surface py-3">
      {(visibleEntries.length > 0 || shouldAppendViewer) && (
        <ul className="flex flex-col gap-1 px-2">
          {visibleEntries.map((entry) => (
            <LeaderboardRow
              key={entry.userId}
              rank={entry.rank}
              name={entry.name}
              avatar={entry.avatar}
              minutes={entry.minutes}
              tierLevel={entry.tierLevel}
              isMe={entry.userId === viewer?.userId}
            />
          ))}
          {shouldAppendViewer && viewer && standing && (
            <>
              <li
                aria-hidden="true"
                className="flex justify-center py-1 text-muted"
              >
                <Ellipsis className="size-4" />
              </li>
              <LeaderboardRow
                rank={standing.rank}
                name={viewer.name}
                avatar={viewer.avatar}
                minutes={standing.minutes}
                tierLevel={viewerTierLevel}
                isMe
              />
            </>
          )}
        </ul>
      )}
      <footer className="mt-2 flex flex-col gap-3 border-t border-border px-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Hiện {shownCount} / {podiumCount + entries.length} người đầu ·{" "}
          {formatThoundsand(participantCount)} {participantLabel}
        </p>
        {hasMore && (
          <Button variant="outline" size="sm" onClick={handleShowMore}>
            Xem thêm
          </Button>
        )}
      </footer>
    </section>
  );
}
