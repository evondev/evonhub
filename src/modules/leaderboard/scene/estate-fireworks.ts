import * as THREE from "three";

import type { FireworkBurst } from "../types/estate.types";

const FIREWORK_COLORS = ["#ffd166", "#ff6b9a", "#5eead4", "#a78bfa", "#ffffff"];
const PARTICLE_COUNT = 110;

export interface EstateFireworks {
  launch: (origin: THREE.Vector3, startAt: number) => void;
  update: (now: number) => void;
  dispose: () => void;
}

/** Pháo hoa lúc lên bậc: mỗi chùm là một đám điểm toả ra, rơi dần, mờ đi */
export function createFireworks(scene: THREE.Scene): EstateFireworks {
  const bursts: FireworkBurst[] = [];

  function removeBurst(index: number): void {
    const burst = bursts[index];
    scene.remove(burst.points);
    burst.points.geometry.dispose();
    (burst.points.material as THREE.Material).dispose();
    bursts.splice(index, 1);
  }

  return {
    launch(origin, startAt) {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3));
      const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const points = new THREE.Points(
        geometry,
        new THREE.PointsMaterial({ color, size: 0.55, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }),
      );
      points.visible = false;
      scene.add(points);
      const velocities = Array.from({ length: PARTICLE_COUNT }, () =>
        new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(7 + Math.random() * 3),
      );
      bursts.push({ points, velocities, origin, start: startAt, life: 1.8 });
    },
    update(now) {
      for (let index = bursts.length - 1; index >= 0; index--) {
        const burst = bursts[index];
        const age = now - burst.start;

        if (age < 0) continue;

        if (age > burst.life) {
          removeBurst(index);
          continue;
        }

        burst.points.visible = true;
        const position = burst.points.geometry.attributes.position;
        const spread = (1 - Math.exp(-age * 1.6)) / 1.6;
        burst.velocities.forEach((velocity, particleIndex) => {
          position.setXYZ(
            particleIndex,
            burst.origin.x + velocity.x * spread,
            burst.origin.y + velocity.y * spread - 2.2 * age * age,
            burst.origin.z + velocity.z * spread,
          );
        });
        position.needsUpdate = true;
        (burst.points.material as THREE.PointsMaterial).opacity = 1 - age / burst.life;
      }
    },
    dispose() {
      for (let index = bursts.length - 1; index >= 0; index--) removeBurst(index);
    },
  };
}
