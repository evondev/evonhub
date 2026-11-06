import { getCurrentUser } from "@/shared/libs/auth";
import { getLeaderboardData } from "../../../services/leaderboard.service";
import { LeaderboardPeriod, LeaderboardViewer } from "../../../types";
import { isLeaderboardParticipant } from "../../../utils";
import { LeaderboardBoard } from "./leaderboard-board";
import { LeaderboardError } from "./leaderboard-error";

interface LeaderboardContentProps {
  period: LeaderboardPeriod;
}

/** Đọc bảng của kỳ ở server rồi giao cho LeaderboardBoard ráp */
export async function LeaderboardContent({ period }: LeaderboardContentProps) {
  const currentUser = await getCurrentUser();
  const viewer: LeaderboardViewer | null =
    currentUser && isLeaderboardParticipant(currentUser.role)
      ? {
          userId: String(currentUser._id),
          username: currentUser.username || "",
          name: currentUser.name || currentUser.username || "",
          avatar: currentUser.avatar || "",
        }
      : null;
  const data = await getLeaderboardData(period, viewer?.userId ?? null).catch(
    (error) => {
      console.log("[leaderboard] Đọc bảng xếp hạng lỗi:", error);

      return undefined;
    },
  );

  if (!data) return <LeaderboardError />;

  return <LeaderboardBoard period={period} data={data} viewer={viewer} />;
}
