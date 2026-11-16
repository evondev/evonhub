import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, cylinderOn, gableRoof, hipRoof, rodBetween } from "./estate-geometry";
import { HOUSE_SPOT } from "./estate-layout";

// Nhà theo bậc, mọi nhà đứng cùng một chỗ và quay mặt ra +z.

function createHouseGroup(): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(HOUSE_SPOT);

  return group;
}

function addWindow(kit: EstateKit, parent: THREE.Object3D, width: number, height: number, position: [number, number, number], rotationY = 0): THREE.Mesh {
  return boxOn(parent, [width, height, 0.12], kit.windowMat, position, rotationY);
}

export function buildTent(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  boxOn(group, [5, 0.06, 5.4], kit.mat("#4a7fb8"), [0, 0, 0]);
  addMesh(group, gableRoof(3.2, 3.6, 2.3), kit.mat("#f08a3c"), [0, 0.04, 0]);
  const doorShape = new THREE.Shape([new THREE.Vector2(-0.7, 0), new THREE.Vector2(0.7, 0), new THREE.Vector2(0, 1.5)]);
  addMesh(group, new THREE.ShapeGeometry(doorShape), kit.mat("#6a3416", { side: THREE.DoubleSide }), [0, 0.06, 1.82], [0, 0, 0], false);
  rodBetween(group, [0, 2.36, -1.9], [0, 2.36, 1.9], 0.05, kit.mat("#7a5a3a"));
  cylinderOn(group, [0.16, 0.2], 0.42, 8, kit.lampMat, [2.0, 0.06, 1.8]);
  boxOn(group, [0.9, 0.5, 0.6], kit.mat("#3f6f4a"), [-2.0, 0.06, 1.5], 0.3);

  return group;
}

export function buildCabin(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  boxOn(group, [7, 0.45, 6], kit.mat("#8a5a35"), [0, 0, 0.4]);
  boxOn(group, [5.4, 2.7, 4.2], kit.mat("#c4874f"), [0, 0.45, 0]);

  for (let row = 0; row < 6; row++) boxOn(group, [5.5, 0.06, 4.3], kit.mat("#a96f3e"), [0, 0.7 + row * 0.42, 0]);

  addMesh(group, gableRoof(6.6, 5.2, 2.1), kit.mat("#7a3e2b"), [0, 3.15, 0]);
  boxOn(group, [1.0, 1.9, 0.14], kit.mat("#5a3420"), [-1.2, 0.45, 2.12]);
  addWindow(kit, group, 1.1, 0.9, [1.3, 1.5, 2.12]);
  addWindow(kit, group, 0.9, 0.8, [2.72, 1.5, 0], Math.PI / 2);
  boxOn(group, [0.7, 2.2, 0.7], kit.mat("#9a948a"), [1.6, 3.6, -1.0]);
  boxOn(group, [1.4, 0.45, 0.5], kit.mat("#6b4428"), [1.6, 0.45, 2.9]);

  return group;
}

export function buildCottage(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  const white = kit.mat("#ffffff");
  boxOn(group, [11, 0.35, 8.4], kit.mat("#cfc6b4"), [0, 0, 0.6]);
  boxOn(group, [9.6, 3.1, 6.4], kit.mat("#f6f0e4"), [0, 0.35, 0]);
  addMesh(group, hipRoof(11.2, 8.0, 2.7), kit.mat("#d0643a"), [0, 3.45 + 1.35, 0]);
  boxOn(group, [1.3, 2.3, 0.14], kit.mat("#7a4a2a"), [0, 0.35, 3.22]);
  [-3.0, 3.0].forEach((windowX) => {
    addWindow(kit, group, 1.4, 1.2, [windowX, 1.5, 3.22]);
    boxOn(group, [0.38, 1.3, 0.1], kit.mat("#3c78b5"), [windowX - 0.92, 1.45, 3.27]);
    boxOn(group, [0.38, 1.3, 0.1], kit.mat("#3c78b5"), [windowX + 0.92, 1.45, 3.27]);
  });
  addWindow(kit, group, 1.2, 1.1, [4.82, 1.5, 0], Math.PI / 2);
  // Bồn nước inox trên mái, rất "nhà Việt".
  addMesh(group, new THREE.CylinderGeometry(0.6, 0.6, 1.6, 12), kit.mat("#c9d1d9", { metalness: 0.6, roughness: 0.35 }), [2.8, 5.2, -1.6], [0, 0, Math.PI / 2]);
  boxOn(group, [1.8, 0.7, 1.0], kit.mat("#7d8791"), [2.8, 4.0, -1.6]);
  // Rào trắng thấp và chậu cây trước sân.
  for (let postX = -5.2; postX <= 5.2; postX += 0.8) {
    if (Math.abs(postX) < 1.0) continue;
    boxOn(group, [0.14, 0.8, 0.14], white, [postX, 0, 5.4]);
  }
  boxOn(group, [4.4, 0.1, 0.1], white, [-3.1, 0.62, 5.4]);
  boxOn(group, [4.4, 0.1, 0.1], white, [3.1, 0.62, 5.4]);
  [-1.4, 1.4].forEach((potX) => {
    cylinderOn(group, [0.32, 0.25], 0.45, 8, kit.mat("#b8643a"), [potX, 0.35, 3.9]);
    addMesh(group, new THREE.IcosahedronGeometry(0.45, 0), kit.mat("#4f9e3a"), [potX, 1.2, 3.9]);
  });

  return group;
}

export function buildTownhouse(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  const white = kit.mat("#fbf7ef");
  const railing = kit.mat("#3b3f45");
  boxOn(group, [9, 0.3, 10.5], kit.mat("#cfc6b4"), [0, 0, 0.4]);
  boxOn(group, [7.6, 6.8, 9], kit.mat("#f5cf6b"), [0, 0.3, 0]);
  boxOn(group, [1.0, 7.4, 9.1], kit.mat("#e39b52"), [-3.4, 0.3, 0]);
  addWindow(kit, group, 5.0, 2.6, [0.5, 0.35, 4.52]);
  boxOn(group, [5.4, 0.18, 0.4], white, [0.5, 2.95, 4.7]);
  // Ban công tầng hai.
  boxOn(group, [7.8, 0.25, 1.6], white, [0.2, 3.4, 5.2]);
  for (let barX = -3.4; barX <= 3.9; barX += 0.45) boxOn(group, [0.06, 1.0, 0.06], railing, [barX, 3.65, 5.95]);
  boxOn(group, [7.6, 0.08, 0.1], railing, [0.2, 4.62, 5.95]);
  addWindow(kit, group, 3.6, 2.4, [0.6, 3.7, 4.52]);
  // Mái bằng có lan can và vườn trên sân thượng.
  const parapets: [number, number, number, number][] = [
    [7.8, 0.3, 0, 4.5],
    [7.8, 0.3, 0, -4.5],
    [0.3, 9.0, 3.8, 0],
    [0.3, 9.0, -3.8, 0],
  ];
  parapets.forEach(([width, depth, parapetX, parapetZ]) => boxOn(group, [width, 0.9, depth], white, [parapetX, 7.1, parapetZ]));
  for (let i = 0; i < 5; i++) {
    addMesh(group, new THREE.IcosahedronGeometry(0.55 + (i % 2) * 0.2, 0), kit.mat(i % 2 ? "#5aa743" : "#3f8f3a"), [-2.6 + i * 1.3, 7.7, 3.4]);
  }
  addMesh(group, new THREE.CylinderGeometry(0.55, 0.55, 1.5, 12), kit.mat("#c9d1d9", { metalness: 0.6, roughness: 0.35 }), [2.2, 7.9, -2.6], [0, 0, Math.PI / 2]);
  addWindow(kit, group, 0.12, 2.2, [3.82, 3.9, -1.5]);

  return group;
}

export function buildModernVilla(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  const wood = kit.mat("#b07a4c");
  const slab = kit.mat("#3b3f45");
  boxOn(group, [17, 0.35, 11.5], kit.mat("#cfc8bc"), [0, 0, 0.3]);
  boxOn(group, [15, 3.4, 9], kit.mat("#f7f5f0"), [0, 0.35, 0]);
  addWindow(kit, group, 9.5, 2.7, [-2.2, 0.55, 4.52]);
  boxOn(group, [4.2, 2.8, 0.15], wood, [4.9, 0.55, 4.55]);
  boxOn(group, [15.8, 0.3, 9.8], slab, [0, 3.75, 0]);
  boxOn(group, [10, 3.2, 8.2], wood, [-2.3, 4.05, -0.6]);
  addWindow(kit, group, 7.6, 2.0, [-2.6, 4.6, 3.52]);
  addWindow(kit, group, 0.12, 2.0, [2.72, 4.6, -0.6]);
  boxOn(group, [10.8, 0.3, 9.0], slab, [-2.3, 7.25, -0.4]);
  // Lan can kính sân thượng phía phải.
  boxOn(group, [4.6, 0.9, 0.08], kit.mat("#bfe6f2", { transparent: true, opacity: 0.45, roughness: 0.1 }), [5.2, 4.05, 4.7]);

  return group;
}

export function buildBeachVilla(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  const white = kit.mat("#fbfaf6");
  const charcoal = kit.mat("#2f3338");
  boxOn(group, [20, 0.4, 13], kit.mat("#d9d1c4"), [0, 0, 0.4]);
  boxOn(group, [18, 3.6, 10], white, [0, 0.4, 0]);
  addWindow(kit, group, 14.5, 2.9, [0.6, 0.6, 5.02]);
  boxOn(group, [18.6, 0.3, 10.8], charcoal, [0, 4.0, 0.2]);
  boxOn(group, [11, 3.4, 9.5], charcoal, [-3.4, 4.3, 0.9]);
  addWindow(kit, group, 10, 2.4, [-3.4, 4.8, 5.67]);
  boxOn(group, [11.6, 0.3, 10.3], white, [-3.4, 7.7, 1.0]);
  boxOn(group, [1.1, 8.6, 6.0], kit.mat("#bfb3a1"), [-9.4, 0.4, -1.2]);
  // Giàn che nắng và ghế trên sân thượng phải.
  const pergolaPosts: [number, number][] = [[2.6, 3.6], [8.4, 3.6], [2.6, -3.4], [8.4, -3.4]];
  pergolaPosts.forEach(([postX, postZ]) => boxOn(group, [0.25, 2.6, 0.25], white, [postX, 4.3, postZ]));
  for (let slatX = 2.4; slatX <= 8.6; slatX += 0.7) boxOn(group, [0.14, 0.18, 7.6], kit.mat("#c89a6a"), [slatX, 6.9, 0.1]);
  [3.6, 6.2].forEach((loungerX) => boxOn(group, [1.0, 0.35, 2.0], kit.mat("#f2efe7"), [loungerX, 4.3, 1.5]));

  return group;
}

export function buildMansion(kit: EstateKit): THREE.Group {
  const group = createHouseGroup();
  const cream = kit.mat("#f4ead6");
  const trim = kit.mat("#ffffff");
  const roof = kit.mat("#3e4a5c");
  boxOn(group, [25, 0.6, 15], kit.mat("#d8cfbf"), [0, 0, 0.6]);
  boxOn(group, [22, 0.4, 13.5], kit.mat("#e7dfd0"), [0, 0.6, 0.4]);
  boxOn(group, [10, 9.2, 11], cream, [0, 1.0, -0.6]);
  [-8, 8].forEach((wingX) => {
    boxOn(group, [6, 6.6, 10], cream, [wingX, 1.0, -0.6]);
    boxOn(group, [6.6, 0.45, 10.6], trim, [wingX, 7.6, -0.6]);
    boxOn(group, [6.4, 0.6, 10.4], roof, [wingX, 8.05, -0.6]);
    for (let row = 0; row < 2; row++) {
      [-1.4, 1.4].forEach((offset) => addWindow(kit, group, 1.2, 1.9, [wingX + offset, 1.8 + row * 3, 4.42]));
    }
  });
  boxOn(group, [10.6, 0.5, 11.6], trim, [0, 10.2, -0.6]);
  for (let row = 0; row < 2; row++) {
    [-3, 3].forEach((windowX) => addWindow(kit, group, 1.3, 2.2, [windowX, 2.0 + row * 3.6, 4.92]));
  }
  // Hiên cột kiểu cổ điển.
  for (let i = 0; i < 6; i++) cylinderOn(group, [0.34, 0.4], 6.8, 12, trim, [-3.75 + i * 1.5, 1.0, 6.4]);
  boxOn(group, [9.6, 0.7, 2.6], trim, [0, 7.8, 5.9]);
  addMesh(group, gableRoof(10.2, 2.8, 2.0), trim, [0, 8.5, 5.9]);
  boxOn(group, [1.8, 3.2, 0.15], kit.mat("#6b4a2e"), [0, 1.0, 4.95]);
  // Mái vòm vàng và cờ.
  cylinderOn(group, [3.0, 3.0], 1.6, 20, trim, [0, 10.7, -0.6]);
  addMesh(group, new THREE.SphereGeometry(3.0, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), kit.mat("#e3b54d", { metalness: 0.55, roughness: 0.35 }), [0, 12.3, -0.6]);
  cylinderOn(group, [0.08, 0.08], 4.5, 6, kit.mat("#d8d8d8"), [0, 15.2, -0.6]);
  const flag = boxOn(group, [2.2, 1.3, 0.05], kit.mat("#7c3aed"), [1.12, 18.2, -0.6]);
  flag.name = "flag";
  // Đài phun nước trước sân.
  cylinderOn(group, [2.4, 2.6], 0.6, 16, trim, [0, 0, 11.5]);
  addMesh(group, new THREE.CylinderGeometry(2.1, 2.1, 0.1, 16), kit.poolWaterMat, [0, 0.58, 11.5]);
  cylinderOn(group, [0.3, 0.45], 1.6, 10, trim, [0, 0.6, 11.5]);
  cylinderOn(group, [0.9, 0.5], 0.3, 12, trim, [0, 2.1, 11.5]);

  return group;
}
