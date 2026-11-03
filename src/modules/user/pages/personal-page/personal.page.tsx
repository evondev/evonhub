import { getUserStudyStanding } from "@/modules/leaderboard/services/leaderboard.service";
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

  // Hạng và phút theo bảng "Tất cả": hồ sơ nói cả quá trình, không riêng tuần này
  const studyStanding = await getUserStudyStanding(profile._id, "all").catch(
    () => ({ rank: 0, minutes: 0 }),
  );
  const displayName = profile.name || profile.username;
  const isOwner = String(currentUser?._id) === String(profile._id);
  // Chưa có phút học, chưa học khóa nào: khối "Đang học" đã nói, bỏ hàng số 0
  const hasStats = studyStanding.minutes > 0 || courses.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <PersonalHeader
          profile={profile}
          displayName={displayName}
          rank={studyStanding.rank}
          isOwner={isOwner}
        />
        {hasStats && (
          <PersonalStats
            studyMinutes={studyStanding.minutes}
            courseCount={courses.length}
          />
        )}
      </header>
      <PersonalCourses courses={courses} displayName={displayName} />
    </div>
  );
}
