import { EstateItemInfo, EstateListRow, EstateSeason } from "../types/estate.types";

export const HOUSE_PATH = "/house";

/** Bậc cao nhất máy này đã xem ở nhà của chính mình; lên cao hơn thì chạy cảnh lên bậc */
export const ESTATE_SEEN_TIER_STORAGE_KEY = "evonhub:estate-seen-tier";

/** Câu báo lên bậc hiện chừng này mili giây rồi ẩn */
export const ESTATE_TOAST_VISIBLE_MS = 4000;

/** Ban ngày từ 6h tới trước 18h theo giờ trên máy */
export const ESTATE_DAY_START_HOUR = 6;
export const ESTATE_DAY_END_HOUR = 18;

/**
 * Mọi món trên đảo, theo bậc. Nguồn sự thật chung cho cảnh 3D, danh sách món và
 * câu thông báo lên bậc. untilTier: bậc cuối còn giữ món, bậc sau thay bằng bản lớn hơn
 */
export const ESTATE_ITEMS: EstateItemInfo[] = [
  { id: "sign", listId: null, name: "Biển báo", tier: 0, untilTier: 0, isHouse: false },
  { id: "tent", listId: null, name: "Lều cắm trại", tier: 1, untilTier: 1, isHouse: true },
  { id: "cabin", listId: null, name: "Nhà gỗ nhỏ", tier: 2, untilTier: 2, isHouse: true },
  { id: "cottage", listId: null, name: "Nhà cấp 4 mái ngói", tier: 3, untilTier: 4, isHouse: true },
  { id: "townhouse", listId: null, name: "Nhà phố 2 tầng", tier: 5, untilTier: 5, isHouse: true },
  { id: "modernVilla", listId: null, name: "Biệt thự", tier: 6, untilTier: 7, isHouse: true },
  { id: "beachVilla", listId: null, name: "Villa ven biển", tier: 8, untilTier: 9, isHouse: true },
  { id: "mansion", listId: null, name: "Dinh thự", tier: 10, untilTier: 10, isHouse: true },
  { id: "campfire", listId: "campfire", name: "Lửa trại", tier: 1, untilTier: 10, isHouse: false },
  { id: "bike", listId: "bike", name: "Xe đạp", tier: 1, untilTier: 10, isHouse: false },
  { id: "jogger1", listId: null, name: "Người chạy bộ", tier: 1, untilTier: 10, isHouse: false },
  { id: "scooter", listId: "scooter", name: "Xe máy", tier: 2, untilTier: 10, isHouse: false },
  { id: "exerciser", listId: null, name: "Người tập thể dục", tier: 2, untilTier: 10, isHouse: false },
  { id: "car", listId: "car", name: "Ô tô con", tier: 3, untilTier: 10, isHouse: false },
  { id: "beachSpot", listId: null, name: "Góc nghỉ mát", tier: 3, untilTier: 10, isHouse: false },
  { id: "balloon", listId: "balloon", name: "Khinh khí cầu", tier: 4, untilTier: 10, isHouse: false },
  { id: "dock", listId: "dock", name: "Bến gỗ", tier: 4, untilTier: 10, isHouse: false },
  { id: "jogger2", listId: null, name: "Người chạy bộ", tier: 4, untilTier: 10, isHouse: false },
  { id: "speedboat", listId: "speedboat", name: "Ca nô", tier: 5, untilTier: 10, isHouse: false },
  { id: "pool", listId: "pool", name: "Hồ bơi", tier: 6, untilTier: 7, isHouse: false },
  { id: "supercar", listId: "supercar", name: "Siêu xe", tier: 6, untilTier: 10, isHouse: false },
  { id: "garden", listId: "garden", name: "Vườn đèn", tier: 7, untilTier: 10, isHouse: false },
  { id: "yachtSmall", listId: "yacht", name: "Du thuyền nhỏ", tier: 7, untilTier: 7, isHouse: false },
  { id: "dockHead", listId: null, name: "Bến mở rộng", tier: 7, untilTier: 10, isHouse: false },
  { id: "poolInfinity", listId: "pool", name: "Hồ bơi tràn bờ", tier: 8, untilTier: 10, isHouse: false },
  { id: "supercar2", listId: "supercar2", name: "Siêu xe thứ hai", tier: 8, untilTier: 10, isHouse: false },
  { id: "yachtBig", listId: "yacht", name: "Du thuyền lớn", tier: 8, untilTier: 10, isHouse: false },
  { id: "jogger3", listId: null, name: "Người chạy bộ", tier: 8, untilTier: 10, isHouse: false },
  { id: "heli", listId: "heli", name: "Trực thăng", tier: 9, untilTier: 10, isHouse: false },
  { id: "jet", listId: "jet", name: "Máy bay riêng", tier: 10, untilTier: 10, isHouse: false },
  { id: "rainbow", listId: "rainbow", name: "Cầu vồng", tier: 10, untilTier: 10, isHouse: false },
];

/** Các dòng ở danh sách món. Món có nhiều bản (hồ bơi, du thuyền) chung một dòng */
export const ESTATE_LIST_ROWS: EstateListRow[] = [
  { listId: "campfire", name: "Lửa trại", tier: 1 },
  { listId: "bike", name: "Xe đạp", tier: 1 },
  { listId: "scooter", name: "Xe máy", tier: 2 },
  { listId: "car", name: "Ô tô con", tier: 3 },
  { listId: "balloon", name: "Khinh khí cầu", tier: 4 },
  { listId: "dock", name: "Bến gỗ", tier: 4 },
  { listId: "speedboat", name: "Ca nô", tier: 5 },
  { listId: "pool", name: "Hồ bơi", tier: 6 },
  { listId: "supercar", name: "Siêu xe", tier: 6 },
  { listId: "garden", name: "Vườn đèn", tier: 7 },
  { listId: "yacht", name: "Du thuyền", tier: 7 },
  { listId: "supercar2", name: "Siêu xe thứ hai", tier: 8 },
  { listId: "heli", name: "Trực thăng", tier: 9 },
  { listId: "jet", name: "Máy bay riêng", tier: 10 },
  { listId: "rainbow", name: "Cầu vồng", tier: 10 },
];

/** Chữ trên biển báo ở bãi đất trống: nhà của mình mời học, nhà người khác chỉ báo */
export const ESTATE_OWN_SIGN_LINES: string[] = ["Học phút đầu tiên", "để dựng lều"];
export const ESTATE_VISIT_SIGN_LINES: string[] = ["Chưa có", "phút học nào"];

/** Những món không nêu tên trong câu báo lên bậc: phụ kiện của món khác */
export const ESTATE_SILENT_ITEM_IDS: string[] = ["dockHead", "sign"];

/* Mùa và dịp, theo ngày trên máy người xem (giống Làng bên speak-now) */

/** Mùa theo tháng, miền Bắc: xuân 2–4, hạ 5–8, thu 9–11, đông 12–1 */
export const ESTATE_SEASON_BY_MONTH: Record<number, EstateSeason> = {
  1: "winter",
  2: "spring",
  3: "spring",
  4: "spring",
  5: "summer",
  6: "summer",
  7: "summer",
  8: "summer",
  9: "autumn",
  10: "autumn",
  11: "autumn",
  12: "winter",
};

export const CHRISTMAS_FROM_DAY = 20;
export const CHRISTMAS_TO_DAY = 26;

/** Mùng 1 Tết các năm; trang trí Tết từ 7 ngày trước tới 7 ngày sau */
export const TET_FIRST_DAYS: string[] = ["2027-02-06", "2028-01-26", "2029-02-13", "2030-02-03"];
export const TET_SPAN_DAYS = 7;

/** Rằm tháng 8 âm lịch các năm; đèn Trung thu từ 7 ngày trước tới 1 ngày sau */
export const MID_AUTUMN_DAYS: string[] = ["2026-09-25", "2027-09-15", "2028-10-03", "2029-09-22", "2030-09-12"];
export const MID_AUTUMN_DAYS_BEFORE = 7;
export const MID_AUTUMN_DAYS_AFTER = 1;
