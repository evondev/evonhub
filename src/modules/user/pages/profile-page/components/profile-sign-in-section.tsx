import { Button } from "@/components/ui/button";
import { ProfileData } from "../../../types";
import { ProfileEmail } from "./profile-email";
import { ProfileRow } from "./profile-row";
import { ProfileSection } from "./profile-section";

export interface ProfileSignInSectionProps {
  profile: ProfileData;
  /** Email, mật khẩu do tài khoản đăng nhập quản lý: mở màn quản lý tài khoản */
  onManageAccount: () => void;
}

export function ProfileSignInSection({
  profile,
  onManageAccount,
}: ProfileSignInSectionProps) {
  return (
    <ProfileSection
      title="Đăng nhập"
      description="Đổi email hay mật khẩu cần xác nhận lại, nên mở ở cửa sổ riêng."
    >
      <ProfileRow label="Email">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
          <p className="min-w-0 text-sm font-medium text-foreground sm:py-2.5">
            <ProfileEmail email={profile.email} />
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 md:h-10"
            onClick={onManageAccount}
          >
            Đổi email
          </Button>
        </div>
      </ProfileRow>

      <ProfileRow label="Mật khẩu">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
          <p className="min-w-0 text-pretty text-sm text-muted sm:py-2.5">
            Đổi mật khẩu, xem thiết bị đang đăng nhập
          </p>
          <Button
            type="button"
            variant="outline"
            className="h-11 shrink-0 md:h-10"
            onClick={onManageAccount}
          >
            Đổi mật khẩu
          </Button>
        </div>
      </ProfileRow>
    </ProfileSection>
  );
}
