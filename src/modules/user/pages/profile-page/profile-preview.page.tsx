"use client";

import {
  LoadErrorState,
  PreviewStateSwitcher,
} from "@/shared/components/common";
import {
  PREVIEW_PROFILES,
  PROFILE_PREVIEW_SAVE_DELAY_MS,
  PROFILE_PREVIEW_STATE_LINKS,
} from "../../constants";
import { ProfilePreviewState } from "../../types";
import { simulatePreviewPublicSave, simulatePreviewSave } from "../../utils";
import { ProfileSkeleton, ProfileView } from "./components";

interface UserProfilePreviewPageProps {
  state: ProfilePreviewState;
}

/** Trang xem trước "Hồ sơ" bằng hồ sơ giả. Không ghi DB, chỉ mở ở dev */
export function UserProfilePreviewPage({ state }: UserProfilePreviewPageProps) {
  const isDataState = state !== "dang-tai" && state !== "loi";
  const savePreview = () => simulatePreviewSave(PROFILE_PREVIEW_SAVE_DELAY_MS);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={PROFILE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      {state === "dang-tai" && <ProfileSkeleton />}
      {state === "loi" && <LoadErrorState title="Chưa tải được hồ sơ" />}
      {isDataState && (
        <ProfileView
          key={state}
          profile={PREVIEW_PROFILES[state]}
          canReceivePayout={state === "chuyen-gia"}
          onSavePublicInfo={(values) =>
            simulatePreviewPublicSave(values, PROFILE_PREVIEW_SAVE_DELAY_MS)
          }
          onSaveSocialLinks={savePreview}
          onSavePayout={savePreview}
          onManageAccount={() => undefined}
        />
      )}
    </div>
  );
}
