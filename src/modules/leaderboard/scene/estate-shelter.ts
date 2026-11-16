import * as THREE from "three";

import type { ShelterAgent } from "../types/estate.types";
import { createSeededRandom } from "./estate-geometry";
import { terrainHeight } from "./estate-terrain";

const RUN_INSIDE_SPEED = 6;
const WALK_BACK_SPEED = 4;
const ARRIVE_DISTANCE = 0.4;
/** Tạnh mưa: mỗi người ra khỏi nhà sau một lúc ngẫu nhiên trong khoảng này */
const MAX_RETURN_DELAY_SECONDS = 2.8;

interface ShelterOptions {
  agents: ShelterAgent[];
  isItemOwned: (itemId: string) => boolean;
  /** Cửa nhà đang có; null là chưa có nhà (bậc 0) */
  getDoor: () => THREE.Vector3 | null;
}

export interface EstateShelter {
  sendEveryoneInside: () => void;
  letEveryoneOut: () => void;
  update: (deltaSeconds: number, time: number, motionScale: number) => void;
  isAway: (runner: ShelterAgent["runner"]) => boolean;
}

// Đi một bước về đích, chân tay đung đưa; trả về true khi đã tới.
function stepToward(agent: ShelterAgent, target: THREE.Vector3, speed: number, deltaSeconds: number, time: number, isShielding: boolean): boolean {
  const { group, limbs } = agent.runner;
  const offset = new THREE.Vector3(target.x - group.position.x, 0, target.z - group.position.z);
  const distance = offset.length();

  if (distance < ARRIVE_DISTANCE) return true;

  const step = Math.min(distance, speed * deltaSeconds);
  group.position.addScaledVector(offset.normalize(), step);
  group.position.y = Math.max(terrainHeight(group.position.x, group.position.z), 0.05);
  group.lookAt(target.x, group.position.y, target.z);
  const swing = Math.sin(time * 14) * 0.9;
  limbs.leftLeg.rotation.x = swing;
  limbs.rightLeg.rotation.x = -swing;
  // Chạy mưa thì giơ hai tay che đầu; đi ra thì vung tay bình thường.
  limbs.leftArm.rotation.x = isShielding ? -2.7 : -swing * 0.8;
  limbs.rightArm.rotation.x = isShielding ? -2.7 : swing * 0.8;
  limbs.leftArm.rotation.z = isShielding ? 0.35 : 0;
  limbs.rightArm.rotation.z = isShielding ? -0.35 : 0;

  return false;
}

function resetLimbs(agent: ShelterAgent): void {
  const { limbs } = agent.runner;
  [limbs.leftLeg, limbs.rightLeg, limbs.leftArm, limbs.rightArm].forEach((limb) => limb.rotation.set(0, 0, 0));
}

/** Mưa bão: ai đang ở ngoài chạy vào cửa nhà, ẩn trong nhà; tạnh thì lần lượt ra chỗ cũ */
export function createShelter({ agents, isItemOwned, getDoor }: ShelterOptions): EstateShelter {
  const random = createSeededRandom(2027);

  return {
    sendEveryoneInside() {
      if (!getDoor()) return;

      agents.forEach((agent) => {
        if (!isItemOwned(agent.itemId) || agent.state === "running" || agent.state === "inside") return;

        if (agent.state === "home" && agent.seated) {
          agent.runner.group.position.copy(agent.homeSpot());
          agent.seated.visible = false;
        }
        agent.runner.group.visible = true;
        agent.state = "running";
      });
    },
    letEveryoneOut() {
      const door = getDoor();

      agents.forEach((agent) => {
        if (agent.state === "inside" && door) {
          agent.runner.group.position.copy(door);
          agent.delay = random() * MAX_RETURN_DELAY_SECONDS;
        }
        if (agent.state === "inside" || agent.state === "running") agent.state = "returning";
      });
    },
    update(deltaSeconds, time, motionScale) {
      const door = getDoor();
      const speedScale = motionScale || 3;

      agents.forEach((agent) => {
        if (agent.state === "running" && door) {
          if (stepToward(agent, door, RUN_INSIDE_SPEED * speedScale, deltaSeconds, time, true)) {
            agent.state = "inside";
            agent.runner.group.visible = false;
          }
        }

        if (agent.state !== "returning") return;

        if (agent.delay > 0) {
          agent.delay -= deltaSeconds;
          return;
        }

        agent.runner.group.visible = true;

        if (!stepToward(agent, agent.homeSpot(), WALK_BACK_SPEED * speedScale, deltaSeconds, time, false)) return;

        agent.state = "home";
        resetLimbs(agent);

        if (agent.seated) {
          agent.runner.group.visible = false;
          agent.seated.visible = true;
        }
      });
    },
    isAway: (runner) => agents.some((agent) => agent.runner === runner && agent.state !== "home"),
  };
}
