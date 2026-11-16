import * as THREE from "three";

import { createSeededRandom } from "./estate-geometry";
import { CAMPFIRE_SPOT, GROUND_Y, ISLAND_RADIUS_X, ISLAND_RADIUS_Z } from "./estate-layout";

const FIREFLY_COUNT = 46;

export interface EstateFireflies {
  points: THREE.Points;
  update: (time: number, motionScale: number) => void;
  dispose: () => void;
}

interface FireflyPath {
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
  phase: number;
  blinkSpeed: number;
}

// Chấm sáng mềm: gradient tròn vẽ lên canvas, cộng sáng nên nền tối thấy rõ.
function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,220,1)");
    gradient.addColorStop(0.25, "rgba(220,255,140,0.85)");
    gradient.addColorStop(1, "rgba(160,255,80,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }

  return new THREE.CanvasTexture(canvas);
}

/** Đom đóm chỉ ra buổi tối: bay lượn quanh bãi cỏ, tụ nhiều gần lửa trại, nhấp nháy lệch nhịp */
export function createFireflies(scene: THREE.Scene): EstateFireflies {
  const random = createSeededRandom(53);
  const paths: FireflyPath[] = Array.from({ length: FIREFLY_COUNT }, (_slot, index) => {
    const isNearFire = index < 12;
    const angle = random() * Math.PI * 2;
    const ring = isNearFire ? 0 : 0.25 + random() * 0.6;
    const nearFireRadius = 2 + random() * 5;

    return {
      baseX: isNearFire ? CAMPFIRE_SPOT.x + Math.cos(angle) * nearFireRadius : ISLAND_RADIUS_X * ring * Math.cos(angle),
      baseY: GROUND_Y + 0.6 + random() * 2.4,
      baseZ: isNearFire ? CAMPFIRE_SPOT.z + Math.sin(angle) * nearFireRadius : ISLAND_RADIUS_Z * ring * Math.sin(angle),
      speed: 0.25 + random() * 0.35,
      phase: random() * Math.PI * 2,
      blinkSpeed: 1.2 + random() * 1.8,
    };
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(FIREFLY_COUNT * 3), 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(new Float32Array(FIREFLY_COUNT * 3), 3));
  const texture = createGlowTexture();
  const material = new THREE.PointsMaterial({
    size: 1.4,
    map: texture,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const points = new THREE.Points(geometry, material);
  points.visible = false;
  scene.add(points);

  return {
    points,
    update(time, motionScale) {
      const position = geometry.attributes.position;
      const color = geometry.attributes.color;
      paths.forEach((path, index) => {
        const drift = time * path.speed * motionScale + path.phase;
        position.setXYZ(
          index,
          path.baseX + Math.sin(drift) * 1.6 + Math.sin(drift * 2.3) * 0.4,
          path.baseY + Math.sin(drift * 1.7) * 0.5,
          path.baseZ + Math.cos(drift * 0.8) * 1.6,
        );
        // Sáng lên rồi tắt hẳn một lúc, như đom đóm thật.
        const blink = Math.max(0, Math.sin(time * path.blinkSpeed + path.phase * 3));
        const brightness = 0.15 + Math.pow(blink, 3) * 0.85;
        color.setXYZ(index, brightness, brightness, brightness * 0.7);
      });
      position.needsUpdate = true;
      color.needsUpdate = true;
    },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
