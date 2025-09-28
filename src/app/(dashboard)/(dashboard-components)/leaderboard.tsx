import { fetchLeaderBoard } from "@/modules/score/actions";
import { IconLongArrowRight } from "@/shared/components";
import { LeaderboardItem } from "@/shared/components/common";
import Link from "next/link";

export interface LeaderboardProps {}

export async function Leaderboard(_props: LeaderboardProps) {
  const leaderboardData = await fetchLeaderBoard({ limit: 5 });
  return (
    <div className="flex flex-col gap-8">
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
        <Link
          href="/leaderboard"
          className="font-bold text-primary inline-flex items-center gap-2"
        >
          <span>Xem tất cả</span>
          <IconLongArrowRight />
        </Link>
      </div>
    </div>
  );
}
