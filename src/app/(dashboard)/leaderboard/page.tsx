"use client";
import { useUserContext } from "@/components/user-context";
import { useMutationSyncLeaderboard } from "@/modules/score/services/data/mutate-sync-leaderboard.data";
import { useQueryLeaderboard } from "@/modules/score/services/data/query-leaderboard.data";
import { Heading } from "@/shared/components";
import { toast } from "react-toastify";

export interface LeaderBoardPageRootProps {}

export default function LeaderBoardPageRoot(_props: LeaderBoardPageRootProps) {
  const mutationSyncLeaderBoard = useMutationSyncLeaderboard();
  const { userInfo } = useUserContext();
  const { data: leaderboardData, isFetching } = useQueryLeaderboard({
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
    <>
      <div className="flex items-center gap-5 justify-between">
        <Heading>Tính năng đang tạm ngưng</Heading>
        {/* <Button
          isLoading={mutationSyncLeaderBoard.isPending}
          variant="primary"
          onClick={handleSyncLeaderBoard}
        >
          Đồng bộ điểm
        </Button> */}
      </div>
      {/* <div className="mb-10 text-sm">Top 100 leaderboard of all time.</div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
        {isFetching && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <LeaderboardItemLoading
                className="p-4 rounded-xl bgDarkMode shadow-sm"
                key={index}
              />
            ))}
          </>
        )}
        {!isFetching &&
          leaderboardData?.map((board, index) => (
            <Card key={board.user._id} className="rounded-xl">
              <LeaderboardItem
                user={board.user}
                score={board.score}
                index={index}
                rank={index + 1}
                className="p-4 bgDarkMode rounded-xl hover:shadow-sm"
              />
            </Card>
          ))}
      </div> */}
    </>
  );
}
