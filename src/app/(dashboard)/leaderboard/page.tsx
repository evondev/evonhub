"use client";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/components/user-context";
import { useMutationSyncLeaderboard } from "@/modules/score/services/data/mutate-sync-leaderboard.data";
import { useQueryLeaderboard } from "@/modules/score/services/data/query-leaderboard.data";
import { Heading } from "@/shared/components";
import { LeaderboardItem } from "@/shared/components/common";
import { toast } from "react-toastify";

export interface LeaderBoardPageRootProps {}

export default function LeaderBoardPageRoot(_props: LeaderBoardPageRootProps) {
  const mutationSyncLeaderBoard = useMutationSyncLeaderboard();
  const { userInfo } = useUserContext();
  const { data: leaderboardData } = useQueryLeaderboard({
    limit: 100,
  });

  const handleSyncLeaderBoard = async () => {
    if (!userInfo?._id) return;
    const response = await mutationSyncLeaderBoard.mutateAsync({
      userId: userInfo?._id,
    });
    if (!response) {
      toast.error("Đồng bộ điểm thất bại");
      return;
    }
    toast.success("Đồng bộ điểm thành công");
  };
  return (
    <div>
      <div className="flex items-center gap-5 justify-between">
        <Heading className="mb-0">LeaderBoard</Heading>
        <Button
          isLoading={mutationSyncLeaderBoard.isPending}
          variant="primary"
          onClick={handleSyncLeaderBoard}
        >
          Sync score
        </Button>
      </div>
      <div className="mb-10 text-sm">Top 100 leaderboard of all time.</div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        {leaderboardData?.map((board, index) => (
          <LeaderboardItem
            key={board.user._id}
            user={board.user}
            score={board.score}
            index={index}
            className="p-4 bgDarkMode rounded-lg border borderDarkMode"
          />
        ))}
      </div>
    </div>
  );
}
