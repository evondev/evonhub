import { getCurrentUser } from "@/shared/libs/auth";

import { STUDY_TIERS } from "../../constants";
import { getUserTierProgress } from "../../services/study-progress.service";
import { HouseOwner, HousePageData } from "../../types/estate.types";
import { resolveEstateTierLevel } from "../../utils/estate.utils";
import { HouseView } from "./components/house-view";

interface HousePageProps {
  ownerId: string;
  owner: HouseOwner;
  /** ?tier= chỉ có hiệu lực khi chạy dev, để soát hình từng bậc */
  previewTier?: string;
  /** ?date=2026-12-24 chỉ có hiệu lực khi chạy dev, để soát mùa và dịp lễ */
  previewDate?: string;
}

/** Đọc bậc của chủ nhà ở server rồi giao cho cảnh 3D ở client */
export async function HousePage({ ownerId, owner, previewTier, previewDate }: HousePageProps) {
  const [currentUser, tierProgress] = await Promise.all([getCurrentUser(), getUserTierProgress(ownerId)]);
  const realTierLevel = tierProgress.tier?.level || 0;
  const isPreviewAllowed = process.env.NODE_ENV !== "production";
  const tierLevel = resolveEstateTierLevel(realTierLevel, previewTier, isPreviewAllowed);
  // Xem thử bậc khác thì giờ học lấy đúng mốc của bậc đó cho các dòng chữ khớp cảnh.
  const totalSeconds =
    tierLevel === realTierLevel
      ? tierProgress.totalSeconds
      : STUDY_TIERS.find((tier) => tier.level === tierLevel)?.minSeconds || 0;
  const data: HousePageData = {
    owner,
    tierLevel,
    totalSeconds,
    isOwnHouse: !!currentUser && String(currentUser._id) === ownerId,
    previewDateKey: isPreviewAllowed && previewDate ? previewDate : null,
  };

  return <HouseView data={data} />;
}
