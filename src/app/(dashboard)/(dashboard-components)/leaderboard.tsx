import { fetchLeaderBoard } from "@/modules/score/actions";
import { LeaderboardItem, ViewAllLink } from "@/shared/components/common";

export interface LeaderboardProps {}

export async function Leaderboard(_props: LeaderboardProps) {
  const leaderboardData = await fetchLeaderBoard({ limit: 5 });
  return (
    <div className="p-5 rounded-xl bgDarkMode flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base lg:text-lg">👑 Leaderboard</h3>
        <ViewAllLink href="/leaderboard" />
      </div>
      <div className="flex flex-col gap-5">
        {leaderboardData?.map((board, index) => (
          <LeaderboardItem
            key={board.user._id}
            user={board.user}
            score={board.score}
            index={index}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
