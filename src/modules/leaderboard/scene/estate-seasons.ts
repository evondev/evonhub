import * as THREE from "three";

import type { EstateKit, EstateSeason } from "../types/estate.types";
import { addMesh, createSeededRandom } from "./estate-geometry";
import { ISLAND_RADIUS_X, ISLAND_RADIUS_Z } from "./estate-layout";
import { getFrondMaterials } from "./estate-scenery";
import { terrainHeight } from "./estate-terrain";

// Mùa theo tháng trên máy người xem:
// - Xuân: cánh hoa hồng bay, bụi hoa đào nở quanh bãi cỏ.
// - Hạ: cảnh như thường.
// - Thu: lá vàng cam đỏ rơi, tàu dừa ngả vàng.
// - Đông: tuyết rơi, tuyết đọng lốm đốm trên cỏ, tàu dừa phủ sương.

interface DriftSettings {
  count: number;
  colors: string[];
  size: number;
  fallSpeed: number;
  sway: number;
}

const DRIFT_BY_SEASON: Record<EstateSeason, DriftSettings | null> = {
  spring: { count: 240, colors: ["#ffc2d9", "#ff9ec4", "#ffe3ee"], size: 0.55, fallSpeed: 1.1, sway: 1.6 },
  summer: null,
  autumn: { count: 260, colors: ["#f59e0b", "#ea580c", "#facc15", "#b45309"], size: 0.6, fallSpeed: 1.5, sway: 1.3 },
  winter: { count: 900, colors: ["#ffffff", "#eef6ff"], size: 0.45, fallSpeed: 2.2, sway: 0.6 },
};

const FROND_TINT: Partial<Record<EstateSeason, { color: string; amount: number }>> = {
  autumn: { color: "#c9a43a", amount: 0.45 },
  winter: { color: "#e3ece8", amount: 0.4 },
};

const DRIFT_BOX = { minX: -55, maxX: 65, minZ: -45, maxZ: 50, top: 40 };
const BLOSSOM_SPOTS: [number, number][] = [[-28, 2], [-10, -20], [4, -22], [25, -9], [22, 12], [-24, 17]];

export interface EstateSeasonEffects {
  update: (time: number, deltaSeconds: number, motionScale: number, windBoost: number) => void;
  dispose: () => void;
}

function createSoftDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.9)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
  }

  return new THREE.CanvasTexture(canvas);
}

function addBlossomBushes(kit: EstateKit, scene: THREE.Scene): void {
  const petals = [kit.mat("#f9a8c9"), kit.mat("#f472b6"), kit.mat("#ffd1e3")];
  const random = createSeededRandom(77);

  BLOSSOM_SPOTS.forEach(([spotX, spotZ]) => {
    const bush = new THREE.Group();
    bush.position.set(spotX, terrainHeight(spotX, spotZ), spotZ);

    for (let i = 0; i < 5; i++) {
      addMesh(bush, new THREE.IcosahedronGeometry(0.7 + random() * 0.5, 0), petals[i % petals.length], [
        (random() - 0.5) * 1.8,
        0.6 + random() * 0.8,
        (random() - 0.5) * 1.8,
      ]);
    }
    scene.add(bush);
  });
}

function addSnowPatches(scene: THREE.Scene): void {
  const random = createSeededRandom(19);
  const patchCount = 110;
  const geometry = new THREE.CircleGeometry(1, 9).rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({ color: "#f8fbff", roughness: 1 });
  const patches = new THREE.InstancedMesh(geometry, material, patchCount);
  const matrix = new THREE.Matrix4();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  for (let i = 0; i < patchCount; i++) {
    const angle = random() * Math.PI * 2;
    const ring = Math.sqrt(random()) * 0.92;
    const patchX = ISLAND_RADIUS_X * ring * Math.cos(angle);
    const patchZ = ISLAND_RADIUS_Z * ring * Math.sin(angle);
    const size = 0.5 + random() * 1.1;
    rotation.setFromAxisAngle(new THREE.Vector3(0, 1, 0), random() * Math.PI);
    scale.set(size, 1, size * (0.6 + random() * 0.6));
    matrix.compose(new THREE.Vector3(patchX, terrainHeight(patchX, patchZ) + 0.13, patchZ), rotation, scale);
    patches.setMatrixAt(i, matrix);
  }
  patches.receiveShadow = true;
  scene.add(patches);
}

export function createSeasonEffects(scene: THREE.Scene, kit: EstateKit): EstateSeasonEffects {
  const { season } = kit.occasions;
  const tint = FROND_TINT[season];

  if (tint) getFrondMaterials(kit).forEach((material) => material.color.lerp(new THREE.Color(tint.color), tint.amount));
  if (season === "spring") addBlossomBushes(kit, scene);
  if (season === "winter") addSnowPatches(scene);

  const drift = DRIFT_BY_SEASON[season];

  if (!drift) return { update: () => undefined, dispose: () => undefined };

  // Hạt rơi: cánh hoa, lá, tuyết. Rơi chậm, đung đưa theo gió, chạm đất thì bay lại từ trên.
  const random = createSeededRandom(313);
  const positions = new Float32Array(drift.count * 3);
  const colors = new Float32Array(drift.count * 3);
  const phases = new Float32Array(drift.count);
  const color = new THREE.Color();

  for (let i = 0; i < drift.count; i++) {
    positions[i * 3] = THREE.MathUtils.lerp(DRIFT_BOX.minX, DRIFT_BOX.maxX, random());
    positions[i * 3 + 1] = random() * DRIFT_BOX.top;
    positions[i * 3 + 2] = THREE.MathUtils.lerp(DRIFT_BOX.minZ, DRIFT_BOX.maxZ, random());
    color.set(drift.colors[i % drift.colors.length]);
    colors.set([color.r, color.g, color.b], i * 3);
    phases[i] = random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const texture = createSoftDotTexture();
  const material = new THREE.PointsMaterial({ size: drift.size, map: texture, vertexColors: true, transparent: true, depthWrite: false });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  scene.add(points);

  return {
    update(time, deltaSeconds, motionScale, windBoost) {
      if (motionScale === 0) return;

      const wind = 0.8 + windBoost * 4;

      for (let i = 0; i < drift.count; i++) {
        const base = i * 3;
        const phase = phases[i];
        positions[base] += (Math.sin(time * 0.9 + phase) * drift.sway + wind) * deltaSeconds;
        positions[base + 1] -= drift.fallSpeed * (1 + windBoost) * deltaSeconds;
        positions[base + 2] += Math.cos(time * 0.7 + phase) * drift.sway * deltaSeconds;
        const groundY = Math.max(terrainHeight(positions[base], positions[base + 2]), 0) + 0.1;

        if (positions[base + 1] < groundY || positions[base] > DRIFT_BOX.maxX) {
          positions[base] = THREE.MathUtils.lerp(DRIFT_BOX.minX, DRIFT_BOX.maxX, (Math.sin(phase * 97 + time) + 1) / 2);
          positions[base + 1] = DRIFT_BOX.top;
        }
      }
      geometry.attributes.position.needsUpdate = true;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
