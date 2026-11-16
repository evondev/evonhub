import * as THREE from "three";

import type { EstateKit, EstateOccasions } from "../types/estate.types";

// Vật liệu dùng chung trong một cảnh. Cache theo màu để mỗi màu chỉ có một
// material; vật liệu đổi theo ngày đêm giữ tham chiếu riêng để bật phát sáng.
export function createEstateKit(occasions: EstateOccasions): EstateKit {
  const materialCache = new Map<string, THREE.MeshStandardMaterial>();

  function mat(
    color: string,
    options: THREE.MeshStandardMaterialParameters = {},
  ): THREE.MeshStandardMaterial {
    const cacheKey = color + JSON.stringify(options);
    const cached = materialCache.get(cacheKey);

    if (cached) return cached;

    const material = new THREE.MeshStandardMaterial({
      color,
      flatShading: true,
      roughness: 0.82,
      ...options,
    });
    materialCache.set(cacheKey, material);

    return material;
  }

  return {
    mat,
    windowMat: new THREE.MeshStandardMaterial({
      color: "#33506b",
      roughness: 0.12,
      metalness: 0.35,
      emissive: "#ffcf7a",
      emissiveIntensity: 0,
      flatShading: true,
    }),
    lampMat: new THREE.MeshStandardMaterial({
      color: "#fff4d6",
      emissive: "#ffd27a",
      emissiveIntensity: 0.2,
      flatShading: true,
    }),
    headlightMat: new THREE.MeshStandardMaterial({
      color: "#f5f7fa",
      emissive: "#fff3c4",
      emissiveIntensity: 0,
      roughness: 0.2,
    }),
    poolWaterMat: new THREE.MeshStandardMaterial({
      color: "#43d3ea",
      emissive: "#1cc8e8",
      emissiveIntensity: 0.12,
      roughness: 0.08,
      metalness: 0.1,
    }),
    flameMat: new THREE.MeshStandardMaterial({
      color: "#ffb340",
      emissive: "#ff7a1a",
      emissiveIntensity: 2.2,
      flatShading: true,
    }),
    padLightMat: new THREE.MeshStandardMaterial({
      color: "#c8ffd9",
      emissive: "#4cff8f",
      emissiveIntensity: 0.3,
    }),
    ghostMat: new THREE.MeshStandardMaterial({
      color: "#9fe8ff",
      emissive: "#4fd2ff",
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      flatShading: true,
    }),
    motion: {
      floating: [],
      flames: [],
      palms: [],
      joggers: [],
      exercisers: [],
      fishes: [],
      clouds: [],
      gulls: [],
      shelterAgents: [],
      festiveLights: [],
      spinners: [],
    },
    occasions,
  };
}
