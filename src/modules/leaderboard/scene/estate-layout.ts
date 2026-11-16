import * as THREE from "three";

// Toạ độ cố định của từng khu trên đảo (mét). Nhà quay mặt ra +z, camera nhìn
// từ phía +x +z, nên bãi xe ở trước bên trái, bến thuyền chìa ra bên phải.

export const GROUND_Y = 1.5;
export const ISLAND_RADIUS_X = 34;
export const ISLAND_RADIUS_Z = 28;

export const HILL = { centerX: -22, centerZ: -14, radius: 8, height: 3.6 };

export const HOUSE_SPOT = new THREE.Vector3(-3, GROUND_Y, -6);

export const PARKING = { minX: -26, maxX: -6, minZ: 5, maxZ: 13.5 };

export const DOCK = { startX: 30, endX: 60, centerZ: 6, deckY: 1.35 };

export const CAMPFIRE_SPOT = new THREE.Vector3(12, GROUND_Y, 13);

export const HELIPAD_SPOT = new THREE.Vector3(17, GROUND_Y, -17);

/** Camera mở trang nhìn vào đây */
export const HOME_TARGET = new THREE.Vector3(8, 3, -2);

/** Người chạy bộ chạy vòng trên bãi cát, ở bán kính chuẩn hoá này */
export const JOG_RING = 1.09;

/** Chỗ đặt đồ của dịp lễ (cây thông, cây đào, đèn Trung thu): bãi cỏ trước bên trái */
export const FESTIVE_SPOT = new THREE.Vector3(-12, GROUND_Y, 18.5);

/** Cửa trước của từng kiểu nhà, tính từ HOUSE_SPOT theo trục z: người trú mưa chạy tới đây */
export const HOME_SPOT_DOOR_OFFSETS: Record<string, number> = {
  tent: 2.4,
  cabin: 3.0,
  cottage: 4.0,
  townhouse: 5.4,
  modernVilla: 5.2,
  beachVilla: 5.8,
  mansion: 7.6,
};
