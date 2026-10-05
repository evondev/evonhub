"use client";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  PROFILE_BIO_MAX_LENGTH,
  PROFILE_PUBLIC_PATH,
  profilePublicSchema,
} from "../../../constants";
import {
  ProfileData,
  ProfilePublicFormValues,
  ProfileSaveResult,
} from "../../../types";
import { buildPublicProfilePath } from "../../../utils";
import { ProfileAvatar } from "./profile-avatar";
import { ProfileField } from "./profile-field";
import { ProfileFormSection } from "./profile-form-section";
import { ProfileRow } from "./profile-row";
import { ProfileUsernameHint } from "./profile-username-hint";

export interface ProfilePublicSectionProps {
  profile: ProfileData;
  onSave: (
    values: ProfilePublicFormValues,
  ) => Promise<ProfileSaveResult | void>;
  /** Ảnh đại diện nằm ở tài khoản đăng nhập: mở màn quản lý tài khoản */
  onManageAccount: () => void;
}

export function ProfilePublicSection({
  profile,
  onSave,
  onManageAccount,
}: ProfilePublicSectionProps) {
  const form = useForm<ProfilePublicFormValues>({
    resolver: zodResolver(profilePublicSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      bio: profile.bio || "",
    },
  });
  const usernameValue = form.watch("username");
  // Theo giá trị đã lưu (reset sau mỗi lần lưu), không theo prop ban đầu
  const savedUsername = form.formState.defaultValues?.username ?? "";
  const isUsernameChanged = usernameValue.trim() !== savedUsername;
  const bioLength = form.watch("bio").length;
  const publicPath = buildPublicProfilePath(
    PROFILE_PUBLIC_PATH,
    usernameValue || "…",
  );

  return (
    <ProfileFormSection
      title="Hồ sơ công khai"
      description="Hiện trên trang cá nhân và bảng xếp hạng, ai cũng xem được."
      form={form}
      onSave={onSave}
    >
      <ProfileRow label="Ảnh đại diện" isCentered>
        <div className="flex items-center gap-4">
          <ProfileAvatar
            name={profile.name}
            seed={profile.username || profile.email}
            src={profile.avatar}
          />
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            <Button
              type="button"
              variant="outline"
              className="h-11 md:h-10"
              onClick={onManageAccount}
            >
              Đổi ảnh
            </Button>
            <p className="text-pretty text-xs text-muted">
              Dùng chung với tài khoản đăng nhập
            </p>
          </div>
        </div>
      </ProfileRow>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <ProfileField label="Họ và tên" isRequired>
            <Input autoComplete="name" {...field} />
          </ProfileField>
        )}
      />

      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <ProfileField
            label="Username"
            isRequired
            hint={
              <ProfileUsernameHint
                publicPath={publicPath}
                isUsernameChanged={isUsernameChanged}
              />
            }
          >
            <Input autoComplete="username" spellCheck={false} {...field} />
          </ProfileField>
        )}
      />

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <ProfileField
            label="Giới thiệu"
            hint="Một hai câu, hiện ngay dưới tên"
            counter={`${bioLength}/${PROFILE_BIO_MAX_LENGTH}`}
            isCounterOver={bioLength > PROFILE_BIO_MAX_LENGTH}
          >
            <Textarea rows={3} {...field} />
          </ProfileField>
        )}
      />
    </ProfileFormSection>
  );
}
