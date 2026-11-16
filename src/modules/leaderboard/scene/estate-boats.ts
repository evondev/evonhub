import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, cylinderOn, hullFromOutline, rodBetween, sideProfile } from "./estate-geometry";
import { DOCK } from "./estate-layout";

type OutlinePoints = [number, number][];

export function buildDock(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  const plank = kit.mat("#b88452");
  const darkPlank = kit.mat("#a8763f");
  const post = kit.mat("#7a5634");
  const plankCount = (DOCK.endX - DOCK.startX) / 0.6;

  for (let i = 0; i < plankCount; i++) {
    boxOn(group, [0.55, 0.22, 3.2], i % 3 === 0 ? darkPlank : plank, [DOCK.startX + 0.3 + i * 0.6, DOCK.deckY - 0.22, DOCK.centerZ]);
  }
  for (let postX = DOCK.startX + 2; postX <= DOCK.endX; postX += 3.5) {
    [-1.7, 1.7].forEach((offset) => cylinderOn(group, [0.16, 0.18], 4.6, 6, post, [postX, -3.2, DOCK.centerZ + offset]));
  }
  cylinderOn(group, [0.1, 0.1], 3.2, 6, kit.mat("#3b3f45"), [DOCK.endX - 0.6, DOCK.deckY, DOCK.centerZ - 1.3]);
  addMesh(group, new THREE.SphereGeometry(0.3, 10, 8), kit.lampMat, [DOCK.endX - 0.6, DOCK.deckY + 3.3, DOCK.centerZ - 1.3]);

  return group;
}

/** Đầu bến chữ T, mở cùng du thuyền */
export function buildDockHead(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  boxOn(group, [4, 0.22, 10], kit.mat("#b88452"), [DOCK.endX + 2, DOCK.deckY - 0.22, DOCK.centerZ + 2.6]);
  for (let postZ = DOCK.centerZ - 2; postZ <= DOCK.centerZ + 7.4; postZ += 3.1) {
    [DOCK.endX + 0.3, DOCK.endX + 3.7].forEach((postX) => cylinderOn(group, [0.16, 0.18], 4.6, 6, kit.mat("#7a5634"), [postX, -3.2, postZ]));
  }

  return group;
}

function createFloatingGroup(kit: EstateKit, positionX: number, positionZ: number, phase: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(positionX, 0, positionZ);
  group.rotation.y = Math.PI;
  kit.motion.floating.push({ group, phase, baseRotationY: Math.PI });

  return group;
}

function scaleOutline(points: OutlinePoints, scaleX: number, scaleY: number): OutlinePoints {
  return points.map(([pointX, pointY]) => [pointX * scaleX, pointY * scaleY]);
}

/** Khối cabin nhìn ngang, mặt trước vát */
function addDeckBlock(kit: EstateKit, parent: THREE.Object3D, size: [number, number, number], rake: number, positionX: number, bottomY: number): void {
  const [length, height, width] = size;
  addMesh(parent, sideProfile([[-length / 2, 0], [length / 2, 0], [length / 2 - rake, height], [-length / 2, height]], width, 0.04), kit.mat("#fbfbf8"), [positionX, bottomY, 0]);
}

export function buildSpeedboat(kit: EstateKit): THREE.Group {
  const group = createFloatingGroup(kit, 46.5, 9.6, 0.4);
  const hullPoints: OutlinePoints = [[-2.8, -1.05], [1.2, -1.05], [2.9, 0], [1.2, 1.05], [-2.8, 1.05]];
  addMesh(group, hullFromOutline(hullPoints, 1.0, 0.35), kit.mat("#fbfbf8"), [0, -0.35, 0]);
  addMesh(group, hullFromOutline(scaleOutline(hullPoints, 1.02, 1.05), 0.18), kit.mat("#e5484d"), [0, 0.5, 0]);
  boxOn(group, [3.6, 0.1, 1.7], kit.mat("#e8e2d4"), [-0.8, 0.62, 0]);
  addMesh(group, new THREE.BoxGeometry(0.08, 0.55, 1.6), kit.mat("#a9d6ea", { transparent: true, opacity: 0.6 }), [0.7, 0.95, 0], [0, 0, -0.5]);
  [-0.4, -1.6].forEach((seatX) => boxOn(group, [0.7, 0.4, 1.5], kit.mat("#2d6cdf"), [seatX, 0.68, 0]));
  boxOn(group, [0.5, 0.9, 0.45], kit.mat("#1f2328"), [-3.0, 0.1, 0]);

  return group;
}

export function buildSmallYacht(kit: EstateKit): THREE.Group {
  const group = createFloatingGroup(kit, 55, 10.8, 1.3);
  const hullPoints: OutlinePoints = [[-4.6, -1.7], [1.8, -1.7], [4.8, 0], [1.8, 1.7], [-4.6, 1.7]];
  addMesh(group, hullFromOutline(hullPoints, 1.8, 0.4), kit.mat("#fbfbf8"), [0, -0.6, 0]);
  addMesh(group, hullFromOutline(scaleOutline(hullPoints, 1.01, 1.03), 0.25), kit.mat("#1f3a5f"), [0, 0.05, 0]);
  boxOn(group, [8.8, 0.1, 3.2], kit.mat("#d9b98c"), [-0.2, 1.2, 0]);
  addDeckBlock(kit, group, [4.6, 1.3, 2.6], 1.0, -0.8, 1.3);
  addMesh(group, sideProfile([[-2.1, 0.45], [1.6, 0.45], [1.3, 0.95], [-2.1, 0.95]], 2.66, 0.02), kit.windowMat, [-0.8, 1.3, 0]);
  addDeckBlock(kit, group, [2.4, 0.9, 2.0], 0.6, -1.2, 2.6);
  rodBetween(group, [-1.2, 3.5, 0], [-1.2, 4.6, 0], 0.05, kit.mat("#c9d1d9"));

  return group;
}

export function buildBigYacht(kit: EstateKit): THREE.Group {
  const group = createFloatingGroup(kit, 54, 17.6, 2.1);
  group.scale.setScalar(0.72);
  const hullPoints: OutlinePoints = [[-11, -2.7], [4.5, -2.7], [11.5, 0], [4.5, 2.7], [-11, 2.7]];
  const teak = kit.mat("#d9b98c");
  addMesh(group, hullFromOutline(hullPoints, 3.0, 0.42), kit.mat("#fbfbf8"), [0, -1.0, 0]);
  addMesh(group, hullFromOutline(scaleOutline(hullPoints, 1.005, 1.02), 0.35), kit.mat("#1d2b45"), [0, 0.15, 0]);
  addMesh(group, hullFromOutline(scaleOutline(hullPoints, 1.006, 1.025), 0.22), kit.windowMat, [0, 1.1, 0]);
  boxOn(group, [21, 0.12, 5.1], teak, [-0.5, 2.0, 0]);
  addDeckBlock(kit, group, [14, 2.0, 4.6], 2.2, -2.0, 2.1);
  addMesh(group, sideProfile([[-6.6, 0.6], [5.2, 0.6], [4.6, 1.5], [-6.6, 1.5]], 4.66, 0.02), kit.windowMat, [-2.0, 2.1, 0]);
  addDeckBlock(kit, group, [9.5, 1.7, 4.0], 1.8, -3.2, 4.1);
  addMesh(group, sideProfile([[-4.4, 0.5], [3.2, 0.5], [2.7, 1.25], [-4.4, 1.25]], 4.06, 0.02), kit.windowMat, [-3.2, 4.1, 0]);
  addDeckBlock(kit, group, [5, 1.4, 3.4], 1.2, -4.0, 5.8);
  addMesh(group, new THREE.TorusGeometry(1.6, 0.18, 6, 16, Math.PI), kit.mat("#e8e8e8"), [-4.6, 7.2, 0], [0, Math.PI / 2, 0]);
  addMesh(group, new THREE.SphereGeometry(0.42, 10, 8), kit.mat("#ffffff"), [-4.6, 8.9, 0]);
  boxOn(group, [2.0, 0.15, 4.4], teak, [-11.8, 0.1, 0]);
  cylinderOn(group, [0.9, 0.9], 0.35, 14, kit.poolWaterMat, [6.5, 2.1, 0]);

  return group;
}
