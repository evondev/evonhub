import * as THREE from "three";

import type { EstateKit } from "../types/estate.types";
import { addMesh, boxOn, createSeededRandom, cylinderOn, rodBetween, UP_AXIS } from "./estate-geometry";
import { CAMPFIRE_SPOT, DOCK, GROUND_Y, HOUSE_SPOT, PARKING } from "./estate-layout";
import { addLyingPerson } from "./estate-life";
import { terrainHeight } from "./estate-terrain";

export function buildCampfire(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(CAMPFIRE_SPOT);
  const log = kit.mat("#6b4428");

  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    addMesh(group, new THREE.DodecahedronGeometry(0.32, 0), kit.mat("#8d8f93"), [Math.cos(angle) * 1.0, 0.15, Math.sin(angle) * 1.0]);
  }
  rodBetween(group, [-0.6, 0.15, -0.3], [0.6, 0.35, 0.3], 0.12, log);
  rodBetween(group, [-0.6, 0.15, 0.3], [0.6, 0.35, -0.3], 0.12, log);
  [0, 1, 2].forEach((index) => {
    const flame = addMesh(group, new THREE.ConeGeometry(0.34 - index * 0.07, 1.1 - index * 0.2, 6), kit.flameMat, [(index - 1) * 0.18, 0.75, (index % 2) * 0.15], [0, 0, 0], false);
    kit.motion.flames.push(flame);
  });
  const benches: [number, number, number][] = [[-2.4, 0, 0.2], [2.4, 0, -0.2], [0, 2.4, Math.PI / 2]];
  benches.forEach(([benchX, benchZ, rotationY]) => {
    addMesh(group, new THREE.CylinderGeometry(0.32, 0.32, 2.2, 8), kit.mat("#8a5a35"), [benchX, 0.32, benchZ], [0, rotationY, Math.PI / 2]);
  });

  return group;
}

/** Hồ bơi bên phải nhà, có người nằm ghế. Bản tràn bờ từ bậc 8 rộng hơn */
export function buildPool(kit: EstateKit, isInfinity: boolean): THREE.Group {
  const group = new THREE.Group();
  const width = isInfinity ? 13 : 8.5;
  const depth = isInfinity ? 5.6 : 4.2;
  group.position.set(isInfinity ? 15.5 : 13.5, GROUND_Y, -3.8);
  boxOn(group, [width + 3, 0.25, depth + 3], kit.mat("#e9e2d4"), [0, 0, 0]);
  boxOn(group, [width, 0.12, depth], kit.poolWaterMat, [0, 0.2, 0]);
  const loungers: [number, number][] = [[width / 2 + 0.6, depth / 2 - 0.4], [width / 2 + 0.6, -depth / 2 + 1.4]];
  loungers.forEach(([loungerX, loungerZ]) => boxOn(group, [0.9, 0.3, 2.0], kit.mat("#ffffff"), [loungerX, 0.25, loungerZ]));
  cylinderOn(group, [0.05, 0.05], 2.4, 6, kit.mat("#8b8f96"), [-width / 2 - 0.9, 0.25, -depth / 2 - 0.6]);
  addMesh(group, new THREE.ConeGeometry(1.5, 0.6, 8), kit.mat(isInfinity ? "#f4f1ea" : "#ef6f5e"), [-width / 2 - 0.9, 2.9, -depth / 2 - 0.6]);
  const loungerSpot = group.position.clone().add(new THREE.Vector3(width / 2 + 1.6, 0, depth / 2 - 0.4));
  addLyingPerson(kit, group, isInfinity ? 1 : 3, [width / 2 + 0.6, 0.55, depth / 2 - 0.4], 0, {
    itemId: isInfinity ? "poolInfinity" : "pool",
    worldSpot: loungerSpot,
  });

  return group;
}

export function buildGarden(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  const lampPositions: [number, number][] = [[8, 3.6], [14, 3.6], [20, 3.6], [26, 3.6], [-8, 15], [-14, 15], [-20, 15], [3, 2]];
  lampPositions.forEach(([lampX, lampZ]) => {
    cylinderOn(group, [0.08, 0.1], 2.6, 6, kit.mat("#2f3338"), [lampX, GROUND_Y, lampZ]);
    addMesh(group, new THREE.SphereGeometry(0.24, 8, 6), kit.lampMat, [lampX, GROUND_Y + 2.75, lampZ]);
  });
  const hedge = kit.mat("#3f8f3a");
  boxOn(group, [1.0, 1.1, 10], hedge, [-16.5, GROUND_Y, -6]);
  boxOn(group, [1.0, 1.1, 8], hedge, [10.5, GROUND_Y, -14]);
  const flowerColors = ["#ff6b9a", "#ffd166", "#ffffff", "#c084fc"];

  for (let i = 0; i < 26; i++) {
    const flowerX = -14 + (i % 13) * 2.1;
    const flowerZ = i < 13 ? 3.2 : -16;

    if (flowerZ === 3.2 && flowerX > -6 && flowerX < 1) continue;
    addMesh(group, new THREE.IcosahedronGeometry(0.32, 0), kit.mat(flowerColors[i % flowerColors.length]), [flowerX, GROUND_Y + 0.35, flowerZ]);
  }

  return group;
}

/* ---------------------------- Cây dừa ---------------------------- */

const FROND_COLORS = ["#3f9a3e", "#4caf4a", "#5bbd52"];

/** Vật liệu tàu dừa, dùng chung để mùa thu ngả vàng, mùa đông phủ sương */
export function getFrondMaterials(kit: EstateKit): THREE.MeshStandardMaterial[] {
  return FROND_COLORS.map((color) => kit.mat(color, { side: THREE.DoubleSide, roughness: 0.7 }));
}

// Tàu lá dừa: dải gấp chữ V dọc sống lá, cong lên rồi rủ xuống, mép răng cưa từng cặp lá chét.
function buildFrondGeometry(length: number, droop: number, width: number): THREE.BufferGeometry {
  const segments = 10;
  const rows: [number, number, number][][] = [];

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const alongX = progress * length;
    const height = (0.5 * progress - droop * progress * progress) * length * 0.45;
    const leafletWidth = width * Math.pow(Math.sin(Math.PI * Math.min(1, progress * 1.12)), 0.6) * (i % 2 ? 0.62 : 1) * (1 - 0.3 * progress);
    const fold = leafletWidth * 0.4;
    rows.push([
      [alongX, height - fold, -leafletWidth],
      [alongX, height, 0],
      [alongX, height - fold, leafletWidth],
    ]);
  }

  const positions: number[] = [];

  for (let i = 0; i < segments; i++) {
    const [leftStart, middleStart, rightStart] = rows[i];
    const [leftEnd, middleEnd, rightEnd] = rows[i + 1];
    positions.push(
      ...leftStart, ...middleStart, ...leftEnd,
      ...middleStart, ...middleEnd, ...leftEnd,
      ...middleStart, ...rightStart, ...middleEnd,
      ...rightStart, ...rightEnd, ...middleEnd,
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();

  return geometry;
}

interface PalmSpot {
  spotX: number;
  spotZ: number;
  height: number;
  lean: number;
}

const PALM_SPOTS: PalmSpot[] = [
  [-31, -1, 7, 0.8], [-29, 9, 8, 0.6], [-18, 21, 7.5, 0.5], [-6, 24.5, 7, 0.7], [6, 23.5, 8, 0.4], [21, 18, 7.5, 0.6],
  [29, 13, 8.5, 0.9], [27, -12, 7.5, 0.5], [6, -24.5, 8, 0.5], [-8, -24, 7, 0.4], [33, -1, 8, 1.0], [37, 2, 7, 1.2],
  [-34, -8, 7.5, 0.7], [-12, -21, 8, 0.4],
].map(([spotX, spotZ, height, lean]) => ({ spotX, spotZ, height, lean }));

function buildPalms(kit: EstateKit, scene: THREE.Scene): void {
  const frondGeometries = [buildFrondGeometry(4.4, 1.5, 0.72), buildFrondGeometry(3.8, 1.9, 0.66), buildFrondGeometry(4.8, 1.2, 0.76)];
  const frondMaterials = getFrondMaterials(kit);
  const trunkMaterials = [kit.mat("#a07a52"), kit.mat("#8f6b46")];
  const coconut = kit.mat("#7a5a2e");

  PALM_SPOTS.forEach(({ spotX, spotZ, height, lean }, palmIndex) => {
    const random = createSeededRandom(palmIndex + 11);
    const group = new THREE.Group();
    group.position.set(spotX, terrainHeight(spotX, spotZ) - 0.1, spotZ);
    group.rotation.y = random() * Math.PI * 2;
    // Thân cong mượt, từng đốt loe ở gốc cho ra vân đốt dừa.
    const segments = 9;
    let previous = new THREE.Vector3(0, 0, 0);

    for (let i = 1; i <= segments; i++) {
      const progress = i / segments;
      const point = new THREE.Vector3(lean * progress * progress * height * 0.35, progress * height, 0);
      const radius = 0.3 - progress * 0.12;
      const piece = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.86, radius * 1.04, previous.distanceTo(point), 7), trunkMaterials[i % 2]);
      piece.position.copy(previous).add(point).multiplyScalar(0.5);
      piece.quaternion.setFromUnitVectors(UP_AXIS, point.clone().sub(previous).normalize());
      piece.castShadow = true;
      group.add(piece);
      previous = point;
    }

    const crown = new THREE.Group();
    crown.position.copy(previous);
    group.add(crown);
    const frondCount = 8;

    for (let i = 0; i < frondCount; i++) {
      const frond = new THREE.Mesh(frondGeometries[i % frondGeometries.length], frondMaterials[Math.floor(random() * frondMaterials.length)]);
      frond.rotation.order = "YZX";
      frond.rotation.y = (i / frondCount) * Math.PI * 2 + random() * 0.35;
      frond.rotation.z = 0.15 + random() * 0.3;
      frond.castShadow = true;
      crown.add(frond);
    }
    // Hai tàu non dựng đứng ở ngọn.
    [0, 1].forEach((index) => {
      const sprout = new THREE.Mesh(frondGeometries[1], frondMaterials[2]);
      sprout.rotation.order = "YZX";
      sprout.rotation.y = index * Math.PI + random();
      sprout.rotation.z = 1.0;
      sprout.scale.setScalar(0.55);
      crown.add(sprout);
    });

    for (let i = 0; i < 4; i++) addMesh(crown, new THREE.SphereGeometry(0.22, 7, 5), coconut, [Math.cos(i * 1.6) * 0.3, -0.25, Math.sin(i * 1.6) * 0.3]);
    scene.add(group);
    kit.motion.palms.push({ crown, phase: random() * 6 });
  });
}

/** Phần cảnh có sẵn từ bậc 0: cây dừa, đá, sân đỗ xe, lối đi lát đá */
export function buildScenery(kit: EstateKit, scene: THREE.Scene): void {
  buildPalms(kit, scene);

  const rockMaterial = kit.mat("#9aa0a6");
  const rockSpots: [number, number][] = [[-36, 6], [-24, -24], [34, -10], [30, 18], [9, 30.5], [14, -28]];
  rockSpots.forEach(([rockX, rockZ], index) => {
    const rock = addMesh(scene, new THREE.DodecahedronGeometry(1 + (index % 3) * 0.6, 0), rockMaterial, [rockX, terrainHeight(rockX, rockZ) + 0.2, rockZ], [index, index * 2, 0]);
    rock.scale.y = 0.7;
  });

  const pavement = kit.mat("#d7d2c8");
  const parkingWidth = PARKING.maxX - PARKING.minX;
  const parkingDepth = PARKING.maxZ - PARKING.minZ;
  boxOn(scene, [parkingWidth, 0.12, parkingDepth], pavement, [(PARKING.minX + PARKING.maxX) / 2, GROUND_Y, (PARKING.minZ + PARKING.maxZ) / 2]);
  for (let lineX = PARKING.minX + 4.4; lineX < PARKING.maxX; lineX += 4.2) boxOn(scene, [0.12, 0.02, 6], kit.mat("#ffffff"), [lineX, GROUND_Y + 0.12, 9.6]);
  boxOn(scene, [3.4, 0.1, 6], pavement, [-3, GROUND_Y, 3.0]);
  for (let stoneX = 1; stoneX < DOCK.startX + 1; stoneX += 1.6) boxOn(scene, [1.1, 0.1, 1.6], pavement, [stoneX, GROUND_Y, 6 + Math.sin(stoneX * 0.4) * 0.2]);
  for (let stoneZ = 7; stoneZ < 12; stoneZ += 1.6) boxOn(scene, [1.1, 0.1, 1.1], pavement, [11, GROUND_Y, stoneZ]);
}

/** Biển báo khi chưa có bậc: chữ vẽ lên canvas */
export function buildEmptySign(kit: EstateKit, text: string[]): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(HOUSE_SPOT).add(new THREE.Vector3(0, 0, 4));
  const wood = kit.mat("#8a5a35");
  cylinderOn(group, [0.14, 0.14], 2.4, 6, kit.mat("#7a5634"), [0, 0, 0]);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 220;
  const context = canvas.getContext("2d");

  if (context) {
    context.fillStyle = "#f6e7c8";
    context.fillRect(0, 0, 512, 220);
    context.fillStyle = "#5a3a1e";
    context.font = "600 40px system-ui, sans-serif";
    context.textAlign = "center";
    text.forEach((line, index) => context.fillText(line, 256, 95 + index * 55));
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const faceMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.12), [wood, wood, wood, wood, faceMaterial, wood]);
  board.position.set(0, 2.9, 0);
  board.castShadow = true;
  group.add(board);

  return group;
}

export function buildClouds(kit: EstateKit, scene: THREE.Scene, cloudMaterial: THREE.MeshStandardMaterial): void {
  const random = createSeededRandom(99);

  for (let i = 0; i < 9; i++) {
    const cloud = new THREE.Group();

    for (let puff = 0; puff < 5; puff++) {
      const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + random() * 3, 0), cloudMaterial);
      mesh.position.set(puff * 4 - 8, random() * 2, random() * 4 - 2);
      mesh.scale.y = 0.6;
      cloud.add(mesh);
    }
    const angle = random() * Math.PI * 2;
    const distance = 120 + random() * 160;
    cloud.position.set(Math.cos(angle) * distance, 48 + random() * 26, Math.sin(angle) * distance);
    scene.add(cloud);
    kit.motion.clouds.push({ cloud, speed: 1.2 + random() * 1.2 });
  }
}

export function buildGulls(kit: EstateKit, scene: THREE.Scene): void {
  const gullMaterial = kit.mat("#ffffff", { side: THREE.DoubleSide });

  for (let i = 0; i < 4; i++) {
    const gull = new THREE.Group();
    const wings = [-1, 1].map((side) => {
      const wing = new THREE.Group();
      addMesh(wing, new THREE.BoxGeometry(0.5, 0.05, 1.4), gullMaterial, [0, 0, side * 0.7], [0, 0, 0], false);
      gull.add(wing);

      return { wing, side };
    });
    addMesh(gull, new THREE.BoxGeometry(0.9, 0.22, 0.25), gullMaterial, [0, 0, 0], [0, 0, 0], false);
    scene.add(gull);
    kit.motion.gulls.push({ gull, wings, radius: 26 + i * 9, height: 18 + i * 3, speed: 0.12 + i * 0.03, phase: i * 1.7 });
  }
}
