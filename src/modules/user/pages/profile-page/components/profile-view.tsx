"use client";

import { PROFILE_PUBLIC_PATH } from "../../../constants";
import {
  ProfileData,
  ProfilePayoutFormValues,
  ProfilePublicFormValues,
  ProfileSaveResult,
  ProfileSocialFormValues,
} from "../../../types";
import { buildPublicProfilePath } from "../../../utils";
import { ProfileHeader } from "./profile-header";
import { ProfilePayoutSection } from "./profile-payout-section";
import { ProfilePublicSection } from "./profile-public-section";
import { ProfileSignInSection } from "./profile-sign-in-section";
import { ProfileSocialSection } from "./profile-social-section";

export interface ProfileViewProps {
  profile: ProfileData;
  /** Chuyên gia, admin mới có khối tài khoản nhận tiền */
  canReceivePayout: boolean;
  onSavePublicInfo: (
    values: ProfilePublicFormValues,
  ) => Promise<ProfileSaveResult | void>;
  onSaveSocialLinks: (
    values: ProfileSocialFormValues,
  ) => Promise<ProfileSaveResult | void>;
  onSavePayout: (
    values: ProfilePayoutFormValues,
  ) => Promise<ProfileSaveResult | void>;
  onManageAccount: () => void;
}

export function ProfileView({
  profile,
  canReceivePayout,
  onSavePublicInfo,
  onSaveSocialLinks,
  onSavePayout,
  onManageAccount,
}: ProfileViewProps) {
  const publicPath = buildPublicProfilePath(
    PROFILE_PUBLIC_PATH,
    profile.username,
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6">
      <ProfileHeader publicPath={publicPath} />
      <ProfilePublicSection
        profile={profile}
        onSave={onSavePublicInfo}
        onManageAccount={onManageAccount}
      />
      <ProfileSocialSection profile={profile} onSave={onSaveSocialLinks} />
      {canReceivePayout && (
        <ProfilePayoutSection profile={profile} onSave={onSavePayout} />
      )}
      <ProfileSignInSection
        profile={profile}
        onManageAccount={onManageAccount}
      />
    </div>
  );
}
