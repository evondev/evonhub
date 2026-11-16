import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, rodBetween, sideProfile, taperTop } from "./estate-geometry";
import { GROUND_Y } from "./estate-layout";

// Xe đỗ ở sân trước bên trái, đỗ chéo để thấy dáng thân từ góc nhìn mặc định.
// Thân xe dựng dọc trục x rồi xoay để đầu xe hướng ra biển.

const PARKING_ROW_Z = 9.2;

function createParkedGroup(parkX: number): { group: THREE.Group; body: THREE.Group } {
  const group = new THREE.Group();
  group.position.set(parkX, GROUND_Y + 0.12, PARKING_ROW_Z);
  group.rotation.y = -0.45;
  const body = new THREE.Group();
  body.rotation.y = -Math.PI / 2;
  group.add(body);

  return { group, body };
}

function addWheel(kit: EstateKit, parent: THREE.Object3D, wheelX: number, wheelZ: number, radius: number, width: number, rimColor = "#c7ccd3"): void {
  addMesh(parent, new THREE.CylinderGeometry(radius, radius, width, 14), kit.mat("#1f2328"), [wheelX, radius, wheelZ], [Math.PI / 2, 0, 0]);
  addMesh(parent, new THREE.CylinderGeometry(radius * 0.55, radius * 0.55, width + 0.02, 10), kit.mat(rimColor, { metalness: 0.6, roughness: 0.3 }), [wheelX, radius, wheelZ], [Math.PI / 2, 0, 0]);
}

export function buildBike(kit: EstateKit): THREE.Group {
  const { group, body } = createParkedGroup(-23.6);
  const frame = kit.mat("#ff7a2f");
  const dark = kit.mat("#22262b");
  [-0.62, 0.62].forEach((wheelX) => addMesh(body, new THREE.TorusGeometry(0.42, 0.05, 6, 18), dark, [wheelX, 0.44, 0]));
  rodBetween(body, [-0.62, 0.44, 0], [-0.05, 0.95, 0], 0.04, frame);
  rodBetween(body, [-0.62, 0.44, 0], [0.1, 0.48, 0], 0.04, frame);
  rodBetween(body, [0.1, 0.48, 0], [-0.05, 0.95, 0], 0.04, frame);
  rodBetween(body, [0.1, 0.48, 0], [0.48, 0.98, 0], 0.04, frame);
  rodBetween(body, [-0.05, 0.95, 0], [0.48, 0.98, 0], 0.04, frame);
  rodBetween(body, [0.62, 0.44, 0], [0.48, 1.1, 0], 0.035, frame);
  rodBetween(body, [0.45, 1.12, -0.32], [0.45, 1.12, 0.32], 0.03, dark);
  boxOn(body, [0.32, 0.08, 0.16], dark, [-0.08, 1.0, 0]);
  addMesh(body, new THREE.BoxGeometry(0.35, 0.22, 0.4), kit.mat("#9a6b3d"), [0.7, 1.05, 0]);

  return group;
}

export function buildScooter(kit: EstateKit): THREE.Group {
  const { group, body } = createParkedGroup(-20.8);
  const paint = kit.mat("#6fd3c0", { roughness: 0.4 });
  addWheel(kit, body, -0.62, 0, 0.27, 0.16);
  addWheel(kit, body, 0.66, 0, 0.27, 0.16);
  addMesh(body, new THREE.SphereGeometry(0.5, 12, 8), paint, [-0.42, 0.68, 0]).scale.set(1.35, 0.72, 0.68);
  boxOn(body, [0.6, 0.12, 0.42], paint, [0.15, 0.3, 0]);
  addMesh(body, new THREE.BoxGeometry(0.16, 0.95, 0.5), paint, [0.56, 0.8, 0], [0, 0, -0.18]);
  boxOn(body, [0.72, 0.12, 0.36], kit.mat("#5b3a26"), [-0.42, 0.98, 0]);
  rodBetween(body, [0.62, 1.2, 0], [0.62, 1.32, 0], 0.08, paint);
  rodBetween(body, [0.62, 1.32, -0.38], [0.62, 1.32, 0.38], 0.03, kit.mat("#2b2f34"));
  addMesh(body, new THREE.SphereGeometry(0.11, 8, 6), kit.headlightMat, [0.72, 1.32, 0]);
  addMesh(body, new THREE.SphereGeometry(0.22, 10, 6), paint, [0.72, 0.42, 0]).scale.set(1, 0.6, 0.7);

  return group;
}

export function buildCompactCar(kit: EstateKit): THREE.Group {
  const { group, body } = createParkedGroup(-16.8);
  const paint = kit.mat("#3d8fe0", { roughness: 0.35, metalness: 0.2 });
  addMesh(body, taperTop(sideProfile([[-2, 0.32], [2, 0.32], [2.08, 0.72], [1.92, 0.95], [0.9, 1.05], [0.32, 1.55], [-1.55, 1.6], [-1.98, 1.2], [-2.06, 0.7]], 1.75), 0.95, 1.6, 0.2), paint);
  addMesh(body, taperTop(sideProfile([[0.78, 1.08], [0.28, 1.5], [-1.45, 1.54], [-1.84, 1.16], [-1.84, 1.08]], 1.8, 0.02), 0.95, 1.6, 0.2), kit.windowMat);
  [-1.32, 1.32].forEach((wheelX) => [-0.82, 0.82].forEach((wheelZ) => addWheel(kit, body, wheelX, wheelZ, 0.36, 0.24)));
  [-0.56, 0.56].forEach((lightZ) => boxOn(body, [0.08, 0.16, 0.34], kit.headlightMat, [2.06, 0.72, lightZ]));
  boxOn(body, [0.06, 0.12, 1.4], kit.mat("#b9c0c8"), [2.08, 0.42, 0]);

  return group;
}

export function buildSupercar(kit: EstateKit, parkX: number, color: string, hasWing: boolean): THREE.Group {
  const { group, body } = createParkedGroup(parkX);
  const paint = kit.mat(color, { roughness: 0.25, metalness: 0.35 });
  const trim = kit.mat("#1c1f24");
  addMesh(body, taperTop(sideProfile([[-2.3, 0.28], [2.3, 0.28], [2.38, 0.52], [1.7, 0.74], [0.55, 0.92], [-0.18, 1.18], [-1.05, 1.15], [-1.95, 0.95], [-2.36, 0.86], [-2.38, 0.48]], 2.0, 0.08), 0.62, 1.18, 0.32), paint);
  addMesh(body, taperTop(sideProfile([[0.48, 0.95], [-0.14, 1.15], [-0.98, 1.12], [-1.45, 0.98]], 2.04, 0.02), 0.62, 1.18, 0.32), kit.windowMat);
  [-1.45, 1.45].forEach((wheelX) => [-0.9, 0.9].forEach((wheelZ) => addWheel(kit, body, wheelX, wheelZ, 0.38, 0.3, "#2b2f36")));
  [-1, 1].forEach((side) => boxOn(body, [0.9, 0.22, 0.06], trim, [-0.7, 0.5, side * 1.02]));
  [-0.68, 0.68].forEach((lightZ) => boxOn(body, [0.06, 0.1, 0.42], kit.headlightMat, [2.3, 0.6, lightZ]));

  if (hasWing) {
    boxOn(body, [0.5, 0.06, 2.0], trim, [-2.15, 1.18, 0]);
    [-0.6, 0.6].forEach((strutZ) => boxOn(body, [0.18, 0.3, 0.06], trim, [-2.1, 0.88, strutZ]));
  }

  return group;
}
