import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, cylinderOn, rodBetween, sideProfile } from "./estate-geometry";
import { HELIPAD_SPOT, HILL } from "./estate-layout";

export const BALLOON_HEIGHT = 30;

export function buildBalloon(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.set(HILL.centerX, BALLOON_HEIGHT, HILL.centerZ);
  const profile = [[0.7, 0], [1.4, 0.7], [3.1, 2.4], [4.2, 4.5], [4.4, 6.2], [3.9, 7.9], [2.7, 9.1], [1.2, 9.7], [0.01, 9.85]].map(
    ([radius, height]) => new THREE.Vector2(radius, height),
  );
  const latheGeometry = new THREE.LatheGeometry(profile, 16);
  const geometry = latheGeometry.toNonIndexed();
  latheGeometry.dispose();
  // Tô từng múi theo góc: đỏ, vàng, trắng, xanh ngọc.
  const palette = ["#ff6b6b", "#ffd166", "#ffffff", "#06b6d4"].map((hex) => new THREE.Color(hex));
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);

  for (let i = 0; i < position.count; i += 3) {
    const centerX = (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
    const centerZ = (position.getZ(i) + position.getZ(i + 1) + position.getZ(i + 2)) / 3;
    const goreIndex = Math.floor(((Math.atan2(centerZ, centerX) + Math.PI) / (Math.PI * 2)) * 16) % palette.length;
    const goreColor = palette[goreIndex];

    for (let vertex = 0; vertex < 3; vertex++) colors.set([goreColor.r, goreColor.g, goreColor.b], (i + vertex) * 3);
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  addMesh(group, geometry, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.7, side: THREE.DoubleSide }));
  boxOn(group, [1.4, 1.0, 1.4], kit.mat("#9b6a3c"), [0, -3.0, 0]);
  const ropeCorners: [number, number][] = [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]];
  ropeCorners.forEach(([cornerX, cornerZ]) => rodBetween(group, [cornerX, -2.0, cornerZ], [cornerX * 1.1, 0.05, cornerZ * 1.1], 0.03, kit.mat("#5b4630")));
  addMesh(group, new THREE.ConeGeometry(0.25, 0.7, 8), kit.flameMat, [0, -1.4, 0]);

  return group;
}

/** Sân đáp có đèn viền và trực thăng đỗ; cánh quạt tên "rotor" để quay chậm */
export function buildHelipad(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(HELIPAD_SPOT);
  const white = kit.mat("#ffffff");
  cylinderOn(group, [5, 5.2], 0.3, 24, kit.mat("#4a5059"), [0, 0, 0]);
  addMesh(group, new THREE.RingGeometry(4.1, 4.4, 32).rotateX(-Math.PI / 2), kit.mat("#ffd23f"), [0, 0.32, 0], [0, 0, 0], false);
  boxOn(group, [0.5, 0.05, 3.2], white, [-1.1, 0.3, 0]);
  boxOn(group, [0.5, 0.05, 3.2], white, [1.1, 0.3, 0]);
  boxOn(group, [1.8, 0.05, 0.5], white, [0, 0.3, 0]);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    addMesh(group, new THREE.SphereGeometry(0.14, 6, 4), kit.padLightMat, [Math.cos(angle) * 4.85, 0.38, Math.sin(angle) * 4.85]);
  }

  const helicopter = new THREE.Group();
  helicopter.position.set(0, 0.3, 0);
  helicopter.rotation.y = -0.6;
  group.add(helicopter);
  const paint = kit.mat("#1f3a5f", { roughness: 0.35, metalness: 0.25 });
  const dark = kit.mat("#2b2f34");
  addMesh(helicopter, new THREE.SphereGeometry(1.25, 14, 10), paint, [0.3, 1.55, 0]).scale.set(1.7, 1.0, 1.0);
  addMesh(helicopter, new THREE.SphereGeometry(1.0, 12, 8, 0, Math.PI, 0, Math.PI / 2), kit.windowMat, [1.2, 1.6, 0], [0, -Math.PI / 2, 0]).scale.set(1.0, 1.0, 1.05);
  rodBetween(helicopter, [-1.6, 1.8, 0], [-5.6, 2.2, 0], 0.22, paint);
  addMesh(helicopter, sideProfile([[0, 0], [0.9, 0], [0.5, 1.5], [0.05, 1.5]], 0.12, 0.02), kit.mat("#ffd23f"), [-5.9, 2.1, 0]);
  addMesh(helicopter, new THREE.CylinderGeometry(0.5, 0.5, 0.06, 10), dark, [-5.6, 2.6, 0.18], [Math.PI / 2, 0, 0]);
  [-0.85, 0.85].forEach((skidZ) => {
    rodBetween(helicopter, [-1.3, 0.12, skidZ], [1.9, 0.12, skidZ], 0.08, dark);
    rodBetween(helicopter, [-0.6, 0.12, skidZ], [-0.4, 0.9, skidZ * 0.6], 0.05, dark);
    rodBetween(helicopter, [1.0, 0.12, skidZ], [0.9, 0.9, skidZ * 0.6], 0.05, dark);
  });
  cylinderOn(helicopter, [0.12, 0.12], 0.6, 6, dark, [0.2, 2.7, 0]);
  const rotor = new THREE.Group();
  rotor.position.set(0.2, 3.3, 0);
  rotor.name = "rotor";
  helicopter.add(rotor);

  for (let i = 0; i < 4; i++) {
    const bladeAngle = (i * Math.PI) / 2;
    addMesh(rotor, new THREE.BoxGeometry(4.2, 0.06, 0.32), dark, [Math.cos(bladeAngle) * 2.1, 0, Math.sin(bladeAngle) * 2.1], [0, -bladeAngle, 0]);
  }

  return group;
}

/** Máy bay riêng: nhóm ngoài để vòng lặp đặt vị trí, thân trong nghiêng cánh khi lượn */
export function buildJet(kit: EstateKit): THREE.Group {
  const pivot = new THREE.Group();
  const jet = new THREE.Group();
  jet.rotation.x = -0.32;
  pivot.add(jet);
  const white = kit.mat("#fbfbfb", { roughness: 0.3, metalness: 0.2 });
  const stripe = kit.mat("#7c3aed");
  addMesh(jet, new THREE.CapsuleGeometry(1.0, 10, 6, 14), white, [0, 0, 0], [0, 0, Math.PI / 2]);
  addMesh(jet, new THREE.ConeGeometry(1.0, 2.2, 14), white, [6.1, 0, 0], [0, 0, -Math.PI / 2]);
  boxOn(jet, [10, 0.18, 2.06], stripe, [0, -0.18, 0]);

  for (let i = 0; i < 6; i++) {
    [-1, 1].forEach((side) => boxOn(jet, [0.35, 0.3, 0.06], kit.windowMat, [3.6 - i * 1.05, 0.15, side * 0.98]));
  }

  const wingShape = new THREE.Shape([new THREE.Vector2(1.6, 0), new THREE.Vector2(-1.4, 0), new THREE.Vector2(-3.4, 7.4), new THREE.Vector2(-2.3, 7.4)]);
  [-1, 1].forEach((side) => {
    const wing = new THREE.ExtrudeGeometry(wingShape, { depth: 0.22, bevelEnabled: false });
    wing.rotateX(Math.PI / 2);
    addMesh(jet, wing, white, [0.8, -0.3, 0]).scale.z = side;
    addMesh(jet, new THREE.CylinderGeometry(0.5, 0.45, 2.4, 10), white, [-4.1, 0.55, side * 1.45], [0, 0, Math.PI / 2]);
  });
  addMesh(jet, sideProfile([[0, 0], [2.4, 0], [0.9, 3.0], [-0.4, 3.0]], 0.2, 0.02), stripe, [-6.4, 0.6, 0]);
  addMesh(jet, new THREE.BoxGeometry(1.6, 0.14, 5.2), white, [-6.6, 3.6, 0]);

  return pivot;
}

export function buildRainbow(): THREE.Group {
  const group = new THREE.Group();
  group.position.set(-22, -4, -52);
  group.rotation.y = 0.59;
  ["#ff4d4d", "#ff9f43", "#ffd93d", "#6bcf63", "#4dabf7", "#5c7cfa", "#9c6ade"].forEach((color, index) => {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(52 - index * 1.25, 0.62, 4, 72, Math.PI),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5, depthWrite: false, fog: false }),
    );
    group.add(band);
  });

  return group;
}
