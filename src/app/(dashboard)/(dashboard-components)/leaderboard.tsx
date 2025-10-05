import { fetchLeaderBoard } from "@/modules/score/actions";
import { Card, LeaderboardItem, ViewAllLink } from "@/shared/components/common";

export interface LeaderboardProps {}

export async function Leaderboard(_props: LeaderboardProps) {
  const leaderboardData = await fetchLeaderBoard({ limit: 5 });
  return (
    <Card className="rounded-xl w-full">
      <div className="p-5 rounded-xl bgDarkMode flex flex-col gap-5">
        <h3 className="font-bold text-base lg:text-lg">Leaderboard</h3>
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
        <ViewAllLink href="/leaderboard" />
      </div>
    </Card>
  );
}
