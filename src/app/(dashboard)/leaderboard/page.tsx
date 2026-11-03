import { LeaderboardPage } from "@/modules/leaderboard/pages";
import { parseLeaderboardPeriod } from "@/modules/leaderboard/utils";

interface LeaderboardPageRootProps {
  searchParams: { period?: string };
}

// Khách vẫn xem được bảng; thẻ của bạn chỉ hiện khi đã đăng nhập
export default function LeaderboardPageRoot({
  searchParams,
}: LeaderboardPageRootProps) {
  return <LeaderboardPage period={parseLeaderboardPeriod(searchParams.period)} />;
}
