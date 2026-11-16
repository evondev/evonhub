import {
  ESTATE_DAY_END_HOUR,
  ESTATE_DAY_START_HOUR,
  ESTATE_ITEMS,
  ESTATE_SILENT_ITEM_IDS,
  HOUSE_PATH,
} from "../constants/estate.constants";
import { EstateItemInfo } from "../types/estate.types";

export function buildHousePath(username: string): string {
  return `${HOUSE_PATH}/${encodeURIComponent(username.trim())}`;
}

export function isEstateItemOwned(item: EstateItemInfo, tierLevel: number): boolean {
  return tierLevel >= item.tier && tierLevel <= item.untilTier;
}

/** Nhà đang có ở bậc này; bậc 0 chưa có nhà */
export function getEstateHouse(tierLevel: number): EstateItemInfo | null {
  return (
    ESTATE_ITEMS.find(
      (item) => item.isHouse && isEstateItemOwned(item, tierLevel),
    ) || null
  );
}

/** Tên các món mở đúng ở bậc này, dùng cho câu "Lên bậc 6: Biệt thự, Hồ bơi..." */
export function getEstateItemNamesAtTier(tierLevel: number): string[] {
  return ESTATE_ITEMS.filter(
    (item) =>
      item.tier === tierLevel && !ESTATE_SILENT_ITEM_IDS.includes(item.id),
  ).map((item) => item.name);
}

/** Bản đang giữ của một dòng danh sách (vd. du thuyền nhỏ hay du thuyền lớn) */
export function getOwnedListItemName(
  listId: string,
  tierLevel: number,
): string | null {
  const ownedItems = ESTATE_ITEMS.filter(
    (item) => item.listId === listId && isEstateItemOwned(item, tierLevel),
  );

  return ownedItems[ownedItems.length - 1]?.name || null;
}

/** Bậc cần dựng: dev được xem thử bậc khác qua ?tier=, production luôn theo giờ học thật */
export function resolveEstateTierLevel(
  realTierLevel: number,
  previewTier: string | undefined,
  isPreviewAllowed: boolean,
): number {
  if (!isPreviewAllowed || previewTier === undefined) return realTierLevel;

  const parsedTier = Number(previewTier);

  if (!Number.isInteger(parsedTier)) return realTierLevel;

  return Math.min(10, Math.max(0, parsedTier));
}

export function isEstateNightHour(hour: number): boolean {
  return hour < ESTATE_DAY_START_HOUR || hour >= ESTATE_DAY_END_HOUR;
}
