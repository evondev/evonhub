import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, createSeededRandom, cylinderOn, rodBetween } from "./estate-geometry";
import { FESTIVE_SPOT } from "./estate-layout";

// Đồ theo dịp lễ, cùng đặt ở FESTIVE_SPOT (các dịp không trùng nhau). Đèn của
// dịp đẩy vào kit.motion.festiveLights để vòng lặp nhấp nháy, tối sáng hơn ngày.

function createGlowMaterial(kit: EstateKit, color: string): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, roughness: 0.4 });
  kit.motion.festiveLights.push(material);

  return material;
}

/** Giáng sinh: cây thông bốn tầng, ngôi sao, quả châu, dây đèn nhấp nháy, quà dưới gốc */
function buildChristmasTree(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(FESTIVE_SPOT);
  const random = createSeededRandom(1225);
  cylinderOn(group, [0.3, 0.38], 1.0, 8, kit.mat("#6b4428"), [0, 0, 0]);
  const tiers: [number, number, number][] = [[2.8, 2.6, 0.8], [2.2, 2.3, 2.2], [1.6, 2.0, 3.5], [1.0, 1.6, 4.6]];
  tiers.forEach(([radius, height, bottomY]) => addMesh(group, new THREE.ConeGeometry(radius, height, 9), kit.mat("#1f6f3a"), [0, bottomY + height / 2, 0]));
  const starMaterial = createGlowMaterial(kit, "#ffd23f");
  addMesh(group, new THREE.OctahedronGeometry(0.45, 0), starMaterial, [0, 6.6, 0], [0, 0, Math.PI / 4]);
  const baubleColors = ["#d62828", "#f4c430", "#ffffff"];
  const bulbMaterials = ["#ff4d4d", "#ffd166", "#5eead4", "#a78bfa"].map((color) => createGlowMaterial(kit, color));

  for (let i = 0; i < 34; i++) {
    const heightShare = random();
    const bulbY = 1.0 + heightShare * 4.8;
    const radiusAtHeight = 2.7 * (1 - heightShare * 0.82) * 0.92;
    const angle = random() * Math.PI * 2;
    const isBulb = i % 2 === 0;
    const material = isBulb ? bulbMaterials[i % bulbMaterials.length] : kit.mat(baubleColors[i % baubleColors.length], { metalness: 0.5, roughness: 0.3 });
    addMesh(group, new THREE.SphereGeometry(isBulb ? 0.11 : 0.18, 8, 6), material, [Math.cos(angle) * radiusAtHeight, bulbY, Math.sin(angle) * radiusAtHeight], [0, 0, 0], false);
  }

  const gifts: [number, number, string, string][] = [[1.6, 1.2, "#d62828", "#ffd23f"], [-1.4, 1.5, "#2d6cdf", "#ffffff"], [0.4, 2.0, "#16a34a", "#ffd23f"]];
  gifts.forEach(([giftX, giftZ, boxColor, ribbonColor]) => {
    boxOn(group, [0.8, 0.7, 0.8], kit.mat(boxColor), [giftX, 0, giftZ]);
    boxOn(group, [0.84, 0.72, 0.16], kit.mat(ribbonColor), [giftX, 0, giftZ]);
    boxOn(group, [0.16, 0.72, 0.84], kit.mat(ribbonColor), [giftX, 0, giftZ]);
  });

  return group;
}

/** Tết: cây đào hồng, treo bốn đèn lồng đỏ quanh tán, tối đèn sáng ấm */
function buildTetTree(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(FESTIVE_SPOT);
  const bark = kit.mat("#5b3a26");
  rodBetween(group, [0, 0, 0], [0.2, 2.4, 0], 0.22, bark, 7);
  rodBetween(group, [0.2, 2.2, 0], [-1.2, 3.3, 0.4], 0.12, bark);
  rodBetween(group, [0.2, 2.4, 0], [1.3, 3.4, -0.3], 0.12, bark);
  const blossoms = [kit.mat("#f9a8c9"), kit.mat("#f472b6"), kit.mat("#ffd1e3")];
  const random = createSeededRandom(2027);

  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    addMesh(group, new THREE.IcosahedronGeometry(0.8 + random() * 0.4, 0), blossoms[i % blossoms.length], [
      Math.cos(angle) * 1.3,
      3.4 + random() * 1.0,
      Math.sin(angle) * 1.3,
    ]);
  }

  const lanternMaterial = createGlowMaterial(kit, "#e11d24");
  const capMaterial = kit.mat("#d4a52c", { metalness: 0.5, roughness: 0.4 });
  [20, 110, 200, 290].forEach((angleDeg) => {
    const angle = THREE.MathUtils.degToRad(angleDeg);
    const lanternX = Math.cos(angle) * 1.9;
    const lanternZ = Math.sin(angle) * 1.9;
    rodBetween(group, [lanternX, 3.3, lanternZ], [lanternX, 2.95, lanternZ], 0.015, kit.mat("#3a2a1a"));
    addMesh(group, new THREE.SphereGeometry(0.32, 12, 10), lanternMaterial, [lanternX, 2.65, lanternZ], [0, 0, 0], false).scale.set(1, 1.2, 1);
    cylinderOn(group, [0.16, 0.16], 0.08, 10, capMaterial, [lanternX, 2.98, lanternZ]);
    cylinderOn(group, [0.04, 0.09], 0.32, 6, kit.mat("#f2c14e"), [lanternX, 1.96, lanternZ]);
  });

  return group;
}

function createStarShape(outerRadius: number, innerRadius: number): THREE.Shape {
  const points: THREE.Vector2[] = [];

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / 10) * Math.PI * 2 + Math.PI / 2;
    points.push(new THREE.Vector2(Math.cos(angle) * radius, Math.sin(angle) * radius));
  }

  return new THREE.Shape(points);
}

/** Trung thu: cột tre, đèn ông sao đỏ xoay chậm, ba đèn lồng tròn treo trên dây */
function buildMidAutumnDecor(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(FESTIVE_SPOT);
  const bamboo = kit.mat("#7fa34a");
  cylinderOn(group, [0.09, 0.11], 4.6, 7, bamboo, [-1.8, 0, 0]);
  cylinderOn(group, [0.07, 0.09], 3.2, 7, bamboo, [2.2, 0, 0]);
  rodBetween(group, [-1.8, 4.2, 0], [-0.4, 4.2, 0], 0.05, bamboo);
  rodBetween(group, [-1.8, 3.0, 0], [2.2, 3.0, 0], 0.012, kit.mat("#3a2a1a"));

  const star = new THREE.Group();
  star.position.set(-0.4, 3.4, 0);
  const starGeometry = new THREE.ExtrudeGeometry(createStarShape(0.75, 0.32), { depth: 0.18, bevelEnabled: false });
  starGeometry.translate(0, 0, -0.09);
  addMesh(star, starGeometry, createGlowMaterial(kit, "#e2453a"), [0, 0, 0], [0, 0, 0], false);
  addMesh(star, new THREE.SphereGeometry(0.12, 8, 6), kit.mat("#ffd23f"), [0, 0, 0.1], [0, 0, 0], false);
  rodBetween(group, [-0.4, 4.2, 0], [-0.4, 4.15, 0], 0.012, kit.mat("#3a2a1a"));
  group.add(star);
  kit.motion.spinners.push(star);

  ["#e2453a", "#f2b53c", "#e8743a"].forEach((color, index) => {
    const lanternX = -0.6 + index * 1.2;
    addMesh(group, new THREE.SphereGeometry(0.28, 12, 10), createGlowMaterial(kit, color), [lanternX + 0.3, 2.62, 0], [0, 0, 0], false);
  });

  return group;
}

/** Đồ của dịp đang diễn ra (nếu có), gắn vào cảnh */
export function buildFestiveDecor(kit: EstateKit, scene: THREE.Scene): void {
  const { isChristmas, isTet, isMidAutumn } = kit.occasions;

  if (isChristmas) scene.add(buildChristmasTree(kit));
  else if (isTet) scene.add(buildTetTree(kit));
  else if (isMidAutumn) scene.add(buildMidAutumnDecor(kit));
}

/**
 * Trăng chỉ hiện buổi tối, mọc trên mặt biển phía sau đảo: camera mặc định nhìn
 * chúc xuống nên đặt thấp mới lọt khung. Trung thu trăng to và vàng hơn.
 */
export function buildMoon(scene: THREE.Scene, isMidAutumn: boolean): THREE.Group {
  const radius = isMidAutumn ? 20 : 14;
  const color = isMidAutumn ? "#ffd36b" : "#fff6d8";
  const moon = new THREE.Group();
  moon.position.set(-130, isMidAutumn ? 2 : 0, -300);
  moon.add(new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), new THREE.MeshBasicMaterial({ color, fog: false })));
  moon.visible = false;
  scene.add(moon);

  return moon;
}
