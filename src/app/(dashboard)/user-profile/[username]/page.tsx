import { fetchUserLeaderboardRank } from "@/modules/score/actions";
import { fetchUserByUsername } from "@/modules/user/actions";
import { UserPersonalPageContainer } from "@/modules/user/pages/personal-page";

export interface UserPersonalPageRootProps {
  params: { username: string };
}

export default async function UserPersonalPageRoot({
  params,
}: UserPersonalPageRootProps) {
  const username = params?.username;
  const user = await fetchUserByUsername({ username });
  const userRank = await fetchUserLeaderboardRank({
    userId: user?._id || "",
  });
  return <UserPersonalPageContainer rank={userRank} />;
}
