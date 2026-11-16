import * as THREE from "three";

import { createSeededRandom, smoothstep } from "./estate-geometry";
import { DOCK, GROUND_Y, HILL, ISLAND_RADIUS_X, ISLAND_RADIUS_Z } from "./estate-layout";

export interface EstateSea {
  sea: THREE.Mesh;
  farSea: THREE.Mesh;
  seaMaterial: THREE.MeshStandardMaterial;
  farSeaMaterial: THREE.MeshStandardMaterial;
  timeUniform: { value: number };
  /** 0..1: bão to thì sóng cao */
  stormUniform: { value: number };
}

export function shoreWobble(angle: number): number {
  return 1 + 0.022 * Math.sin(3 * angle + 0.7) + 0.014 * Math.sin(7 * angle + 2.1) + 0.008 * Math.sin(13 * angle);
}

/** 0 ở tâm đảo, 1 ở mép cỏ, lớn hơn 1 là bãi cát rồi ra biển */
export function normalizedRadius(pointX: number, pointZ: number): number {
  const angle = Math.atan2(pointZ / ISLAND_RADIUS_Z, pointX / ISLAND_RADIUS_X);

  return Math.hypot(pointX / ISLAND_RADIUS_X, pointZ / ISLAND_RADIUS_Z) / shoreWobble(angle);
}

/** Độ cao mặt đảo: bãi cỏ phẳng, bờ cỏ, bãi cát thoai thoải, đáy biển sâu dần */
export function terrainHeight(pointX: number, pointZ: number): number {
  const radius = normalizedRadius(pointX, pointZ);
  let height: number;

  if (radius <= 1) height = GROUND_Y;
  else if (radius <= 1.04) height = THREE.MathUtils.lerp(GROUND_Y, 0.95, (radius - 1) / 0.04);
  else if (radius <= 1.25) height = THREE.MathUtils.lerp(0.95, -0.45, (radius - 1.04) / 0.21);
  else if (radius <= 1.7) height = THREE.MathUtils.lerp(-0.45, -4.5, (radius - 1.25) / 0.45);
  else height = THREE.MathUtils.lerp(-4.5, -16, Math.min(1, (radius - 1.7) / 1.5));

  const hillDistance = Math.hypot(pointX - HILL.centerX, pointZ - HILL.centerZ) / HILL.radius;

  if (hillDistance < 1 && radius < 1) height += HILL.height * (1 - smoothstep(0, 1, hillDistance));

  return height;
}

/** Điểm trên vòng chạy bộ; đi ngang bến thì bước lên mặt bến */
export function ringPoint(angle: number, ring: number): THREE.Vector3 {
  const wobble = shoreWobble(angle);
  const pointX = ISLAND_RADIUS_X * ring * wobble * Math.cos(angle);
  const pointZ = ISLAND_RADIUS_Z * ring * wobble * Math.sin(angle);
  let height = terrainHeight(pointX, pointZ);
  const isOnDock = pointX > DOCK.startX && pointX < DOCK.endX && Math.abs(pointZ - DOCK.centerZ) < 1.8;

  if (isOnDock) height = Math.max(height, DOCK.deckY);

  return new THREE.Vector3(pointX, Math.max(height, 0.05), pointZ);
}

export function buildIsland(scene: THREE.Scene): void {
  const rings = [0, 0.12, 0.24, 0.36, 0.48, 0.58, 0.67, 0.75, 0.82, 0.88, 0.93, 0.97, 1.0, 1.04, 1.09, 1.15, 1.21, 1.27, 1.36, 1.5, 1.7, 2.0, 2.5, 3.2];
  const segments = 128;
  const positions: number[] = [];
  const random = createSeededRandom(7);

  rings.forEach((ring) => {
    for (let segmentIndex = 0; segmentIndex < segments; segmentIndex++) {
      const isEdge = ring === 1.0 || ring === 1.04 || ring === 0;
      const angle = (segmentIndex / segments) * Math.PI * 2 + (isEdge ? 0 : (random() - 0.5) * 0.02);
      const wobble = shoreWobble(angle);
      const pointX = ISLAND_RADIUS_X * ring * wobble * Math.cos(angle);
      const pointZ = ISLAND_RADIUS_Z * ring * wobble * Math.sin(angle);
      let height = terrainHeight(pointX, pointZ);

      if (ring > 0.3 && ring < 0.97) height += random() * 0.1;
      positions.push(pointX, height, pointZ);
    }
  });

  const indices: number[] = [];

  for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex++) {
    for (let segmentIndex = 0; segmentIndex < segments; segmentIndex++) {
      const nextSegment = (segmentIndex + 1) % segments;
      const current = ringIndex * segments + segmentIndex;
      const currentNext = ringIndex * segments + nextSegment;
      const outer = (ringIndex + 1) * segments + segmentIndex;
      const outerNext = (ringIndex + 1) * segments + nextSegment;
      indices.push(current, currentNext, outer, currentNext, outerNext, outer);
    }
  }

  const indexedGeometry = new THREE.BufferGeometry();
  indexedGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  indexedGeometry.setIndex(indices);
  const geometry = indexedGeometry.toNonIndexed();
  indexedGeometry.dispose();

  // Màu theo từng mặt tam giác: cỏ, bờ cỏ, cát khô, cát ướt, đáy cạn tới sâu.
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const grassLight = new THREE.Color("#7ccf5b");
  const grassDark = new THREE.Color("#6cbf4f");
  const bank = new THREE.Color("#c2a46a");
  const sand = new THREE.Color("#f3dea5");
  const wetSand = new THREE.Color("#dcc287");
  const shallow = new THREE.Color("#e6d7a0");
  const deep = new THREE.Color("#1b6b86");
  const faceColor = new THREE.Color();

  for (let i = 0; i < position.count; i += 3) {
    const centerX = (position.getX(i) + position.getX(i + 1) + position.getX(i + 2)) / 3;
    const centerY = (position.getY(i) + position.getY(i + 1) + position.getY(i + 2)) / 3;
    const centerZ = (position.getZ(i) + position.getZ(i + 1) + position.getZ(i + 2)) / 3;
    const radius = normalizedRadius(centerX, centerZ);

    if (radius < 0.995) {
      faceColor
        .copy(grassLight)
        .lerp(grassDark, 0.5 + 0.5 * Math.sin(centerX * 0.21 + Math.cos(centerZ * 0.17) * 2))
        .offsetHSL(0, 0, (random() - 0.5) * 0.015);
    } else if (radius < 1.045) faceColor.copy(bank);
    else if (centerY > 0.25) faceColor.copy(sand).offsetHSL(0, 0, (random() - 0.5) * 0.02);
    else if (centerY > -0.5) faceColor.copy(wetSand);
    else faceColor.copy(shallow).lerp(deep, smoothstep(-0.5, -9, centerY));

    for (let vertex = 0; vertex < 3; vertex++) colors.set([faceColor.r, faceColor.g, faceColor.b], (i + vertex) * 3);
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const island = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  island.receiveShadow = true;
  scene.add(island);
}

// Biển gần đảo trong suốt để thấy bãi cạn ngả xanh ngọc; sóng chạy trong
// shader nên CPU không phải tính lại mấy nghìn đỉnh mỗi khung hình.
export function buildSea(scene: THREE.Scene): EstateSea {
  const timeUniform = { value: 0 };
  const stormUniform = { value: 0 };
  const seaMaterial = new THREE.MeshStandardMaterial({
    color: "#22b4c9",
    transparent: true,
    opacity: 0.78,
    roughness: 0.22,
    metalness: 0.05,
    flatShading: true,
  });
  seaMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = timeUniform;
    shader.uniforms.uStorm = stormUniform;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uStorm;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float seaDistance = length(transformed.xz);
        float seaAmplitude = (0.06 + 0.32 * smoothstep(45.0, 110.0, seaDistance)) * (1.0 + 2.5 * uStorm);
        transformed.y += (sin(transformed.x * 0.13 + uTime * 0.9) * 0.6
          + sin(transformed.z * 0.17 - uTime * 1.1) * 0.4
          + sin((transformed.x + transformed.z) * 0.31 + uTime * 1.7) * 0.25) * seaAmplitude;`,
      );
  };
  const seaGeometry = new THREE.RingGeometry(0.01, 170, 72, 34);
  seaGeometry.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(seaGeometry, seaMaterial);
  sea.receiveShadow = true;
  scene.add(sea);

  const farSeaMaterial = new THREE.MeshStandardMaterial({ color: "#1f8fae", roughness: 0.3, flatShading: true });
  const farSea = new THREE.Mesh(new THREE.RingGeometry(170, 3000, 72, 1).rotateX(-Math.PI / 2), farSeaMaterial);
  farSea.position.y = -0.02;
  scene.add(farSea);

  return { sea, farSea, seaMaterial, farSeaMaterial, timeUniform, stormUniform };
}

/** Viền bọt trắng ở mép nước */
export function buildFoam(scene: THREE.Scene): THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial> {
  const segments = 160;
  const positions: number[] = [];
  const indices: number[] = [];

  for (let segmentIndex = 0; segmentIndex <= segments; segmentIndex++) {
    const angle = (segmentIndex / segments) * Math.PI * 2;
    const wobble = shoreWobble(angle);
    [1.17, 1.2].forEach((ring) => {
      positions.push(ISLAND_RADIUS_X * ring * wobble * Math.cos(angle), 0.09, ISLAND_RADIUS_Z * ring * wobble * Math.sin(angle));
    });

    if (segmentIndex < segments) {
      const base = segmentIndex * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  const foam = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55, depthWrite: false }),
  );
  scene.add(foam);

  return foam;
}
