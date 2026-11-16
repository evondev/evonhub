import * as THREE from "three";

import { createSeededRandom } from "./estate-geometry";

// Mưa bão bấm tay (theo Làng bên speak-now): mưa xiên, chớp loé, sấm qua onThunder.
// Mưa là một LineSegments, mỗi giọt hai đỉnh, cập nhật trên CPU; máy yếu ít giọt
// hơn; trời quang thì ẩn hẳn, không tốn khung hình.
const DROP_COUNT = 2600;
const LITE_DROP_COUNT = 1000;
const RAIN_TOP = 34;
const DROP_LENGTH = 1.1;
const RAIN_RADIUS = 75;
const RAIN_CENTER = new THREE.Vector3(8, 0, 0);
const WIND_SLANT = new THREE.Vector3(0.22, 0, 0.12);
const RAMP_UP_SECONDS = 3;
const RAMP_DOWN_SECONDS = 4.5;
const FLASH_INTENSITY = 3.2;

/** Độ bão dưới mức này thì người trú mưa lần lượt ra ngoài */
export const STORM_LET_OUT_LEVEL = 0.25;

interface RainDrop {
  dropX: number;
  dropZ: number;
  speed: number;
  offset: number;
}

export interface EstateStorm {
  setActive: (isActive: boolean, time: number) => void;
  /** Trả về độ bão 0..1 để cảnh làm tối trời, lụi lửa, cho người vào nhà */
  update: (deltaSeconds: number, time: number) => number;
  dispose: () => void;
}

export function createStorm(scene: THREE.Scene, isLite: boolean, onThunder: (delaySeconds: number, strength: number) => void): EstateStorm {
  const random = createSeededRandom(4711);
  const drops: RainDrop[] = Array.from({ length: isLite ? LITE_DROP_COUNT : DROP_COUNT }, () => {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * RAIN_RADIUS;

    return {
      dropX: RAIN_CENTER.x + Math.cos(angle) * radius,
      dropZ: RAIN_CENTER.z + Math.sin(angle) * radius,
      speed: 26 + random() * 10,
      offset: random() * RAIN_TOP,
    };
  });
  const positions = new Float32Array(drops.length * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: "#cfdcec", transparent: true, opacity: 0, depthWrite: false });
  const rain = new THREE.LineSegments(geometry, material);
  rain.frustumCulled = false;
  rain.visible = false;
  scene.add(rain);
  const flashLight = new THREE.AmbientLight("#dfe8ff", 0);
  scene.add(flashLight);

  let target = 0;
  let amount = 0;
  let flash = 0;
  let nextStrikeAt = 0;
  let pendingFlickerAt = -1;

  function strikeLightning(time: number): void {
    const strength = 0.6 + random() * 0.4;
    flash = strength;
    pendingFlickerAt = time + 0.12 + random() * 0.1;
    onThunder(0.35 + random() * 1.4, strength);
    nextStrikeAt = time + 5 + random() * 8;
  }

  function updateRain(time: number): void {
    const visibleCount = Math.floor(drops.length * amount);

    for (let i = 0; i < visibleCount; i++) {
      const drop = drops[i];
      const fallen = (time * drop.speed + drop.offset) % RAIN_TOP;
      const topX = drop.dropX + fallen * WIND_SLANT.x;
      const topY = RAIN_TOP - fallen;
      const topZ = drop.dropZ + fallen * WIND_SLANT.z;
      const base = i * 6;
      positions[base] = topX;
      positions[base + 1] = topY;
      positions[base + 2] = topZ;
      positions[base + 3] = topX + WIND_SLANT.x * DROP_LENGTH;
      positions[base + 4] = topY - DROP_LENGTH;
      positions[base + 5] = topZ + WIND_SLANT.z * DROP_LENGTH;
    }
    geometry.setDrawRange(0, visibleCount * 2);
    geometry.attributes.position.needsUpdate = true;
  }

  return {
    setActive(isActive, time) {
      target = isActive ? 1 : 0;

      if (isActive) nextStrikeAt = time + 2.5;
    },
    update(deltaSeconds, time) {
      const rampSeconds = target > amount ? RAMP_UP_SECONDS : RAMP_DOWN_SECONDS;
      amount = THREE.MathUtils.clamp(amount + Math.sign(target - amount) * (deltaSeconds / rampSeconds), 0, 1);

      if (Math.abs(target - amount) < 0.005) amount = target;
      if (target > 0 && amount > 0.7 && time > nextStrikeAt) strikeLightning(time);
      if (pendingFlickerAt > 0 && time > pendingFlickerAt) {
        flash = Math.max(flash, 0.7);
        pendingFlickerAt = -1;
      }

      flash *= Math.exp(-deltaSeconds * 12);
      flashLight.intensity = flash * FLASH_INTENSITY;
      rain.visible = amount > 0;

      if (rain.visible) {
        material.opacity = 0.5 * amount;
        updateRain(time);
      }

      return amount;
    },
    dispose() {
      scene.remove(rain, flashLight);
      geometry.dispose();
      material.dispose();
    },
  };
}
