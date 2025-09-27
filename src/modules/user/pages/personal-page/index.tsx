"use client";
import { CourseItem } from "@/modules/course/components";
import { CourseList, IconStarFilled } from "@/shared/components";
import { Spinner } from "@/shared/components/common";
import IconFacebook from "@/shared/components/icons/IconFacebook";
import IconLinkedin from "@/shared/components/icons/IconLinkedin";
import IconYoutube from "@/shared/components/icons/IconYoutube";
import { handleCheckMembership } from "@/shared/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQueryUserByUsername, useQueryUserCourses } from "../../services";

export interface UserPersonalPageContainerProps {
  rank?: number;
}

export function UserPersonalPageContainer({
  rank,
}: UserPersonalPageContainerProps) {
  const params = useParams();
  const { data: userProfile, isFetching: isFetchingUserProfile } =
    useQueryUserByUsername({
      username: params?.username as string,
    });
  const isMembershipUserActive = handleCheckMembership({
    isMembership: userProfile?.isMembership,
    endDate: userProfile?.planEndDate || new Date().toISOString(),
  });

  const { data, isFetching } = useQueryUserCourses({
    userId: userProfile?.clerkId as string,
    courseOnly: true,
  });
  const userCourses = data?.courses || [];

  if (isFetchingUserProfile) return <Spinner />;

  return (
    <div>
      <div className="flex flex-col gap-8">
        <div className="p-5 rounded-2xl bgDarkMode flex lg:items-center items-start gap-3 lg:gap-5 relative">
          <div className="size-16 lg:size-28 rounded-full borderDarkMode relative visible ring-4 ring-primary/30">
            <Image
              src={userProfile?.avatar || "/default-avatar.png"}
              width={200}
              height={200}
              alt="User Avatar"
              className="size-full rounded-full object-cover"
            />
          </div>
          <div>
            {rank && rank >= 1 && rank <= 3 ? (
              <div className="font-extrabold text-secondary text-xs lg:text-sm uppercase">
                Top {rank} leaderboard
              </div>
            ) : null}
            <h1 className="font-bold text-lg lg:text-2xl">
              {userProfile?.username}
            </h1>
            <div className="text-xs lg:text-sm mb-1 font-medium">
              {userProfile?.bio}
            </div>
            {userProfile?.createdAt && (
              <div className="text-xs text-gray-500">
                <span>Tham gia từ </span>
                <span className="font-medium">
                  {new Date(userProfile.createdAt).toLocaleDateString("vi-VI")}
                </span>
              </div>
            )}
            {isMembershipUserActive && (
              <>
                <IconStarFilled className="absolute top-2 right-2 size-6 text-yellow-400" />
                <div className="text-primary font-semibold text-sm">
                  Membership
                </div>
              </>
            )}
          </div>
          <div className="ml-auto flex items-center gap-5">
            <div className="flex gap-3 [&>*]:size-5 [&>*]:opacity-50">
              <IconFacebook></IconFacebook>
              <IconLinkedin></IconLinkedin>
              <IconYoutube></IconYoutube>
            </div>
            {rank && rank >= 1 && rank <= 3 ? (
              <Image
                src={`/gems/gem-rank${rank}.png`}
                alt="score"
                width={120}
                height={120}
                className="size-10 lg:size-16 hidden lg:block"
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <h2 className="font-bold text-xl lg:text-2xl">
            <span className="capitalize">{userProfile?.username}</span> đang học
          </h2>
          <CourseList isLoading={isFetching}>
            {userCourses?.map((course, index) => (
              <CourseItem key={index} data={course}></CourseItem>
            ))}
          </CourseList>
        </div>
      </div>
    </div>
  );
}
