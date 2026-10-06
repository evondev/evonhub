import { fetchUserLeaderboardRank } from "@/modules/score/actions";
import { getCurrentUser } from "@/shared/libs/auth";
import { notFound } from "next/navigation";
import { fetchPublicUserCourses } from "../../actions";
import { getPublicProfile } from "../../services/public-profile.service";
import { PersonalCourses } from "./components/personal-courses";
import { PersonalHeader } from "./components/personal-header";
import { PersonalPageError } from "./components/personal-page-error";
import { PersonalStats } from "./components/personal-stats";

interface UserPersonalPageProps {
  username: string;
}

/** Trang hồ sơ công khai: người xem thường bấm vào từ bảng xếp hạng */
export async function UserPersonalPage({ username }: UserPersonalPageProps) {
  const [profile, courses, currentUser] = await Promise.all([
    getPublicProfile(username),
    fetchPublicUserCourses({ username }),
    getCurrentUser(),
  ]);

  // page.tsx đã chặn user không tồn tại; còn đây là phòng khi gọi trang từ chỗ khác
  if (profile === null) notFound();

  if (!profile || !courses) return <PersonalPageError />;

  const rank = await fetchUserLeaderboardRank({ userId: profile._id });
  const displayName = profile.name || profile.username;
  const isOwner = String(currentUser?._id) === String(profile._id);
  // Chưa có điểm, chưa học khóa nào: khối "Đang học" đã nói, bỏ hàng số 0
  const hasStats = profile.score > 0 || courses.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PersonalHeader
          profile={profile}
          displayName={displayName}
          rank={rank || 0}
          isOwner={isOwner}
        />
        {hasStats && (
          <PersonalStats score={profile.score} courseCount={courses.length} />
        )}
      </header>
      <PersonalCourses courses={courses} displayName={displayName} />
    </div>
  );
}
