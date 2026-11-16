import { UserAvatar } from "@/shared/components/common/user-avatar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { LEADERBOARD_PATH, STUDY_TIERS } from "../../../constants";
import { HousePageData } from "../../../types/estate.types";
import { formatStudyDuration, getStudyTierByLevel } from "../../../utils";
import { getEstateItemNamesAtTier } from "../../../utils/estate.utils";

interface HouseHeaderCardProps {
  data: HousePageData;
}

/** Thẻ đầu trang: chủ nhà, bậc, tổng giờ; nhà của mình thêm dòng còn bao lâu lên bậc kế */
export function HouseHeaderCard({ data }: HouseHeaderCardProps) {
  const { owner, tierLevel, totalSeconds, isOwnHouse } = data;
  const tier = getStudyTierByLevel(tierLevel);
  const nextTier = STUDY_TIERS.find((studyTier) => studyTier.level === tierLevel + 1);
  const title = isOwnHouse ? "Nhà của bạn" : `Nhà của ${owner.name}`;
  const tierLine = tier
    ? `Bậc ${tier.level} · ${tier.name} · ${formatStudyDuration(totalSeconds)} học`
    : "Chưa có phút học nào";
  const nextLine = nextTier
    ? `Còn ${formatStudyDuration(nextTier.minSeconds - totalSeconds, true)} lên ${nextTier.name}: ${getEstateItemNamesAtTier(nextTier.level).join(", ")}`
    : "Đã ở bậc cao nhất";

  return (
    <header className="pointer-events-auto flex max-w-md flex-col gap-3 rounded-2xl border border-border bg-surface/90 p-4 shadow-sm backdrop-blur">
      <Link
        href={LEADERBOARD_PATH}
        className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Bảng xếp hạng
      </Link>
      <div className="flex items-center gap-3">
        <UserAvatar name={owner.name} avatar={owner.avatar} className="size-11 text-base" />
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted">{tierLine}</p>
          {isOwnHouse && <p className="mt-0.5 text-xs text-primary">{nextLine}</p>}
        </div>
      </div>
    </header>
  );
}
