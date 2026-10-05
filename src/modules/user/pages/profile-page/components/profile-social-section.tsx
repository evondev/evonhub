"use client";

import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PROFILE_SOCIAL_FIELDS, profileSocialSchema } from "../../../constants";
import {
  ProfileData,
  ProfileSocialFormValues,
  ProfileSaveResult,
} from "../../../types";
import { ProfileField } from "./profile-field";
import { ProfileFormSection } from "./profile-form-section";

export interface ProfileSocialSectionProps {
  profile: ProfileData;
  onSave: (
    values: ProfileSocialFormValues,
  ) => Promise<ProfileSaveResult | void>;
}

export function ProfileSocialSection({
  profile,
  onSave,
}: ProfileSocialSectionProps) {
  const form = useForm<ProfileSocialFormValues>({
    resolver: zodResolver(profileSocialSchema),
    defaultValues: {
      facebook: profile.socials?.facebook || "",
      youtube: profile.socials?.youtube || "",
      linkedin: profile.socials?.linkedin || "",
    },
  });

  return (
    <ProfileFormSection
      title="Mạng xã hội"
      description="Hiện thành biểu tượng trên trang cá nhân. Để trống thì ẩn."
      form={form}
      onSave={onSave}
    >
      {PROFILE_SOCIAL_FIELDS.map((socialField) => (
        <FormField
          key={socialField.name}
          control={form.control}
          name={socialField.name}
          render={({ field }) => (
            <ProfileField label={socialField.label}>
              <Input
                type="url"
                inputMode="url"
                spellCheck={false}
                placeholder={socialField.placeholder}
                {...field}
              />
            </ProfileField>
          )}
        />
      ))}
    </ProfileFormSection>
  );
}
