import { HousePage } from "@/modules/leaderboard/pages";
import { getPublicProfile } from "@/modules/user/services/public-profile.service";
import { notFound } from "next/navigation";

interface HousePageRootProps {
  params: { username: string };
  searchParams: { tier?: string; date?: string };
}

// Khách cũng xem được, như bảng xếp hạng: trang chỉ lộ tên, avatar, bậc, tổng
// giờ. Tra user trước để không có thì trả 404 thật.
export default async function HousePageRoot({ params, searchParams }: HousePageRootProps) {
  const username = decodeURIComponent(params.username);
  const profile = await getPublicProfile(username);

  if (!profile) notFound();

  return (
    <HousePage
      ownerId={String(profile._id)}
      owner={{
        username: profile.username || username,
        name: profile.name || profile.username || username,
        avatar: profile.avatar || "",
      }}
      previewTier={searchParams.tier}
      previewDate={searchParams.date}
    />
  );
}
