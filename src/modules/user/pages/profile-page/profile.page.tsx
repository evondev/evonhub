"use client";

import { useUserContext } from "@/components/user-context";
import { LoadErrorState } from "@/shared/components/common";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "../../actions";
import { UpdateMyProfileParams } from "../../types";
import { ProfileSkeleton, ProfileView } from "./components";

export function UserProfilePage() {
  const { userInfo, isFetchingUser } = useUserContext();
  const { isLoaded: isAuthLoaded } = useAuth();
  const { openUserProfile } = useClerk();
  const queryClient = useQueryClient();

  if (!userInfo) {
    if (!isAuthLoaded || isFetchingUser) return <ProfileSkeleton />;

    return <LoadErrorState title="Chưa tải được hồ sơ" />;
  }

  async function saveProfile(params: UpdateMyProfileParams) {
    const saveResult = await updateMyProfile(params);

    if (saveResult.isSuccess) {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
    }

    return saveResult;
  }

  return (
    <ProfileView
      profile={userInfo}
      canReceivePayout={userInfo.role !== UserRole.User}
      onSavePublicInfo={(values) => saveProfile({ section: "public", values })}
      onSaveSocialLinks={(values) =>
        saveProfile({ section: "socials", values })
      }
      onSavePayout={(values) => saveProfile({ section: "payout", values })}
      onManageAccount={() => openUserProfile()}
    />
  );
}
