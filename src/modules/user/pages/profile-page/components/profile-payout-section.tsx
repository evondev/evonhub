"use client";

import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PROFILE_PAYOUT_FIELDS, profilePayoutSchema } from "../../../constants";
import {
  ProfileData,
  ProfilePayoutFormValues,
  ProfileSaveResult,
} from "../../../types";
import { ProfileField } from "./profile-field";
import { ProfileFormSection } from "./profile-form-section";

export interface ProfilePayoutSectionProps {
  profile: ProfileData;
  onSave: (
    values: ProfilePayoutFormValues,
  ) => Promise<ProfileSaveResult | void>;
}

export function ProfilePayoutSection({
  profile,
  onSave,
}: ProfilePayoutSectionProps) {
  const form = useForm<ProfilePayoutFormValues>({
    resolver: zodResolver(profilePayoutSchema),
    defaultValues: {
      bankName: profile.bank?.bankName || "",
      bankNumber: profile.bank?.bankNumber || "",
      bankAccount: profile.bank?.bankAccount || "",
      bankBranch: profile.bank?.bankBranch || "",
    },
  });

  return (
    <ProfileFormSection
      title="Tài khoản nhận tiền"
      description="Dùng khi Evondev chuyển tiền cho bạn. Không hiện trên trang công khai."
      form={form}
      onSave={onSave}
    >
      {PROFILE_PAYOUT_FIELDS.map((payoutField) => (
        <FormField
          key={payoutField.name}
          control={form.control}
          name={payoutField.name}
          render={({ field }) => (
            <ProfileField label={payoutField.label} hint={payoutField.hint}>
              <Input
                inputMode={payoutField.inputMode}
                spellCheck={false}
                className={cn(
                  payoutField.inputMode === "numeric" && "tabular-nums",
                )}
                {...field}
              />
            </ProfileField>
          )}
        />
      ))}
    </ProfileFormSection>
  );
}
