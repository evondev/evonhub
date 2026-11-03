import { PreviewStateSwitcher } from "@/shared/components/common";
import {
  PREVIEW_LEADERBOARD_STATE_LINKS,
  PREVIEW_VIEWER,
} from "../../constants/leaderboard-preview.constants";
import { LeaderboardPreviewState } from "../../types";
import { buildPreviewLeaderboardData } from "../../utils/leaderboard-preview.utils";
import { LeaderboardBoard } from "../leaderboard-page/components/leaderboard-board";
import { LeaderboardError } from "../leaderboard-page/components/leaderboard-error";
import { LeaderboardPeriodTabs } from "../leaderboard-page/components/leaderboard-period-tabs";
import { LeaderboardSkeleton } from "../leaderboard-page/components/leaderboard-skeleton";

interface LeaderboardPreviewPageProps {
  state: LeaderboardPreviewState;
}

/**
 * Trang xem trước bảng tuần bằng người giả: huy hiệu bậc, thẻ của bạn, thẻ
 * bậc, các trạng thái rỗng, tải, lỗi. Không đọc, không ghi DB. Route chỉ mở ở dev.
 */
export function LeaderboardPreviewPage({ state }: LeaderboardPreviewPageProps) {
  const viewer = state === "khach" ? null : PREVIEW_VIEWER;

  return (
    <div className="flex flex-col gap-6">
      <PreviewStateSwitcher
        links={PREVIEW_LEADERBOARD_STATE_LINKS}
        currentState={state}
      />
      <LeaderboardPeriodTabs period="week" />
      {state === "dang-tai" && <LeaderboardSkeleton />}
      {state === "loi" && <LeaderboardError />}
      {state !== "dang-tai" && state !== "loi" && (
        <LeaderboardBoard
          period="week"
          data={buildPreviewLeaderboardData(state)}
          viewer={viewer}
        />
      )}
    </div>
  );
}
