import { describe, expect, it } from "vitest";
import { ESTATE_ITEMS, ESTATE_LIST_ROWS } from "../constants/estate.constants";
import {
  buildHousePath,
  getEstateHouse,
  getEstateItemNamesAtTier,
  getOwnedListItemName,
  isEstateNightHour,
  resolveEstateTierLevel,
} from "./estate.utils";

describe("getEstateHouse", () => {
  it("mỗi bậc từ 1 tới 10 có đúng một nhà", () => {
    for (let tierLevel = 1; tierLevel <= 10; tierLevel++) {
      const houses = ESTATE_ITEMS.filter(
        (item) =>
          item.isHouse && tierLevel >= item.tier && tierLevel <= item.untilTier,
      );

      expect(houses).toHaveLength(1);
    }
  });

  it("bậc 0 chưa có nhà", () => {
    expect(getEstateHouse(0)).toBeNull();
  });

  it("bậc 4 vẫn giữ nhà cấp 4, bậc 10 là dinh thự", () => {
    expect(getEstateHouse(4)?.name).toBe("Nhà cấp 4 mái ngói");
    expect(getEstateHouse(10)?.name).toBe("Dinh thự");
  });
});

describe("getEstateItemNamesAtTier", () => {
  it("bậc 6 mở biệt thự, hồ bơi, siêu xe", () => {
    expect(getEstateItemNamesAtTier(6)).toEqual(["Biệt thự", "Hồ bơi", "Siêu xe"]);
  });

  it("không nêu phụ kiện như bến mở rộng", () => {
    expect(getEstateItemNamesAtTier(7)).not.toContain("Bến mở rộng");
  });
});

describe("getOwnedListItemName", () => {
  it("du thuyền nhỏ ở bậc 7, du thuyền lớn từ bậc 8", () => {
    expect(getOwnedListItemName("yacht", 7)).toBe("Du thuyền nhỏ");
    expect(getOwnedListItemName("yacht", 8)).toBe("Du thuyền lớn");
    expect(getOwnedListItemName("yacht", 6)).toBeNull();
  });

  it("mọi dòng danh sách đều có món ở bậc mở của dòng", () => {
    ESTATE_LIST_ROWS.forEach((row) => {
      expect(getOwnedListItemName(row.listId, row.tier)).not.toBeNull();
    });
  });
});

describe("resolveEstateTierLevel", () => {
  it("production bỏ qua ?tier=", () => {
    expect(resolveEstateTierLevel(3, "9", false)).toBe(3);
  });

  it("dev dựng bậc xem thử, kẹp trong 0..10", () => {
    expect(resolveEstateTierLevel(3, "9", true)).toBe(9);
    expect(resolveEstateTierLevel(3, "42", true)).toBe(10);
    expect(resolveEstateTierLevel(3, "abc", true)).toBe(3);
  });
});

describe("buildHousePath và isEstateNightHour", () => {
  it("mã hoá username", () => {
    expect(buildHousePath("tuan dev")).toBe("/house/tuan%20dev");
  });

  it("6h tới trước 18h là ngày", () => {
    expect(isEstateNightHour(5)).toBe(true);
    expect(isEstateNightHour(6)).toBe(false);
    expect(isEstateNightHour(17)).toBe(false);
    expect(isEstateNightHour(18)).toBe(true);
  });
});
