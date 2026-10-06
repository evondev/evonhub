import { Button } from "@/components/ui/button";
import { UserInfoData } from "@/shared/types/user.types";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { PROFILE_EDIT_PATH } from "../../../constants";
import { formatJoinedMonth, getProfileSocialLinks } from "../../../utils";
import { ProfileAvatar } from "../../profile-page/components/profile-avatar";
import { PersonalRankBadge } from "./personal-rank-badge";
import { ProfileSocialLinks } from "./profile-social-links";

interface PersonalHeaderProps {
  profile: UserInfoData;
  displayName: string;
  /** Hạng trên bảng xếp hạng, chỉ 1–3 mới có huy hiệu */
  rank: number;
  isOwner: boolean;
}

export function PersonalHeader({
  profile,
  displayName,
  rank,
  isOwner,
}: PersonalHeaderProps) {
  const socialLinks = getProfileSocialLinks(profile.socials);
  const hasSocialLinks = socialLinks.length > 0;
  const hasRankBadge = rank >= 1 && rank <= 3;

  return (
    <div className="flex min-w-0 flex-1 gap-4 sm:gap-5">
      <ProfileAvatar
        name={displayName}
        seed={profile.username}
        src={profile.avatar}
        className="size-16 sm:size-20"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
          <h1 className="text-balance text-xl font-semibold text-foreground">
            {displayName}
          </h1>
          {hasRankBadge && <PersonalRankBadge rank={rank} />}
        </div>
        <p className="mt-1 flex flex-col text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-3">
          <span>@{profile.username}</span>
          {profile.createdAt && (
            <span>Tham gia {formatJoinedMonth(profile.createdAt)}</span>
          )}
        </p>
        {profile.bio && (
          <p className="mt-3 max-w-[60ch] text-pretty text-sm text-foreground/80">
            {profile.bio}
          </p>
        )}
        {(hasSocialLinks || isOwner) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {hasSocialLinks && <ProfileSocialLinks socialLinks={socialLinks} />}
            {hasSocialLinks && isOwner && (
              <span aria-hidden className="mx-1 h-5 w-px bg-border-strong" />
            )}
            {isOwner && (
              <Button asChild variant="outline" size="sm">
                <Link href={PROFILE_EDIT_PATH}>
                  <Pencil aria-hidden className="size-4" />
                  Sửa hồ sơ
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
