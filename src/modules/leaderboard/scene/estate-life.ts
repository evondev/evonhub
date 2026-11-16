import * as THREE from "three";

import type { EstateKit, PersonRig, ShelterAgent } from "../types/estate.types";
import { addMesh, boxOn, createSeededRandom, cylinderOn } from "./estate-geometry";
import { GROUND_Y, ISLAND_RADIUS_X, ISLAND_RADIUS_Z, JOG_RING } from "./estate-layout";
import { ringPoint, shoreWobble, terrainHeight } from "./estate-terrain";

interface PersonLook {
  shirt: string;
  shorts: string;
  skin: string;
  hair: string;
}

const PEOPLE_LOOKS: PersonLook[] = [
  { shirt: "#ff6b6b", shorts: "#2f3e5c", skin: "#f1c7a0", hair: "#2b1d14" },
  { shirt: "#4dabf7", shorts: "#1f2937", skin: "#d9a77c", hair: "#1a1410" },
  { shirt: "#ffd166", shorts: "#3b4a3f", skin: "#c58c63", hair: "#4a2e1a" },
  { shirt: "#ffffff", shorts: "#e5484d", skin: "#f1c7a0", hair: "#111111" },
  { shirt: "#a78bfa", shorts: "#334155", skin: "#e2b089", hair: "#3a2416" },
];

const HIPS_Y = 0.86;

/** Người chibi: chân, tay gắn ở khớp hông, vai để đung đưa được */
function buildPerson(kit: EstateKit, look: PersonLook): PersonRig {
  const group = new THREE.Group();
  const legs = [-1, 1].map((side) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.12, HIPS_Y, 0);
    addMesh(leg, new THREE.BoxGeometry(0.17, 0.42, 0.2), kit.mat(look.shorts), [0, -0.2, 0]);
    addMesh(leg, new THREE.BoxGeometry(0.15, 0.42, 0.17), kit.mat(look.skin), [0, -0.6, 0]);
    addMesh(leg, new THREE.BoxGeometry(0.17, 0.08, 0.28), kit.mat("#f4f4f4"), [0, -0.83, 0.04]);
    group.add(leg);

    return leg;
  });
  addMesh(group, new THREE.BoxGeometry(0.46, 0.6, 0.26), kit.mat(look.shirt), [0, HIPS_Y + 0.3, 0]);
  const arms = [-1, 1].map((side) => {
    const arm = new THREE.Group();
    arm.position.set(side * 0.31, HIPS_Y + 0.56, 0);
    addMesh(arm, new THREE.BoxGeometry(0.13, 0.26, 0.14), kit.mat(look.shirt), [0, -0.12, 0]);
    addMesh(arm, new THREE.BoxGeometry(0.11, 0.32, 0.12), kit.mat(look.skin), [0, -0.4, 0]);
    group.add(arm);

    return arm;
  });
  addMesh(group, new THREE.SphereGeometry(0.22, 10, 8), kit.mat(look.skin), [0, HIPS_Y + 0.83, 0]);
  addMesh(group, new THREE.SphereGeometry(0.235, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), kit.mat(look.hair), [0, HIPS_Y + 0.86, -0.02]);

  // Giáng sinh: ai cũng đội mũ Noel.
  if (kit.occasions.isChristmas) {
    addMesh(group, new THREE.CylinderGeometry(0.25, 0.25, 0.08, 10), kit.mat("#ffffff"), [0, HIPS_Y + 1.0, 0]);
    addMesh(group, new THREE.ConeGeometry(0.22, 0.42, 10), kit.mat("#d62828"), [0.06, HIPS_Y + 1.22, -0.04], [0.25, 0, -0.35]);
    addMesh(group, new THREE.SphereGeometry(0.07, 8, 6), kit.mat("#ffffff"), [0.16, HIPS_Y + 1.38, -0.08]);
  }

  return { group, limbs: { leftLeg: legs[0], rightLeg: legs[1], leftArm: arms[0], rightArm: arms[1] } };
}

/**
 * Ghi một người trú mưa: dáng gốc (nằm, tập) ẩn khi vắng nhà, bản đứng chạy vào nhà.
 * Bản đứng chưa gắn vào cảnh; createEstateScene gắn vào sau.
 */
function registerShelterRunner(kit: EstateKit, itemId: string, lookIndex: number, seated: THREE.Object3D, worldSpot: THREE.Vector3): void {
  const runner = buildPerson(kit, PEOPLE_LOOKS[lookIndex % PEOPLE_LOOKS.length]);
  runner.group.visible = false;
  const agent: ShelterAgent = {
    itemId,
    runner,
    seated,
    homeSpot: () => worldSpot,
    isJogger: false,
    state: "home",
    delay: 0,
  };
  kit.motion.shelterAgents.push(agent);
}

/** Người nằm ngửa, thân dọc theo trục z của chỗ nằm (khăn, ghế). shelter: trú mưa được */
export function addLyingPerson(
  kit: EstateKit,
  parent: THREE.Object3D,
  lookIndex: number,
  position: [number, number, number],
  rotationY: number,
  shelter?: { itemId: string; worldSpot: THREE.Vector3 },
): void {
  const holder = new THREE.Group();
  holder.position.set(...position);
  holder.rotation.y = rotationY;
  parent.add(holder);
  const person = buildPerson(kit, PEOPLE_LOOKS[lookIndex % PEOPLE_LOOKS.length]);
  person.group.rotation.x = -Math.PI / 2;
  person.group.position.set(0, 0.13, 0.9);
  person.limbs.leftArm.rotation.z = -0.25;
  person.limbs.rightArm.rotation.z = 0.25;
  holder.add(person.group);

  if (shelter) registerShelterRunner(kit, shelter.itemId, lookIndex, holder, shelter.worldSpot);
}

/** Người chạy bộ vòng quanh đảo trên bãi cát */
export function buildJogger(kit: EstateKit, itemId: string, lookIndex: number, startAngle: number, speed: number): THREE.Group {
  const person = buildPerson(kit, PEOPLE_LOOKS[lookIndex]);
  person.group.position.copy(ringPoint(startAngle, JOG_RING));
  const jogger = { ...person, angle: startAngle, speed, phase: startAngle * 3 };
  kit.motion.joggers.push(jogger);
  kit.motion.shelterAgents.push({
    itemId,
    runner: jogger,
    seated: null,
    homeSpot: () => ringPoint(jogger.angle, JOG_RING),
    isJogger: true,
    state: "home",
    delay: 0,
  });

  return person.group;
}

/** Tập nhảy dang tay chân trên thảm ở bãi cỏ trước */
export function buildExerciser(kit: EstateKit): THREE.Group {
  const spot = new THREE.Group();
  spot.position.set(2, GROUND_Y, 17);
  spot.rotation.y = 0.5;
  boxOn(spot, [0.9, 0.03, 1.9], kit.mat("#7c3aed"), [0, 0.02, 0]);
  const person = buildPerson(kit, PEOPLE_LOOKS[2]);
  person.group.position.y = 0.05;
  spot.add(person.group);
  kit.motion.exercisers.push(person);
  registerShelterRunner(kit, "exerciser", 2, person.group, spot.position.clone());

  return spot;
}

/** Góc nghỉ mát trên bãi cát trước: ô, hai khăn, hai người nằm, bóng, thùng đá, ván lướt */
export function buildBeachSpot(kit: EstateKit): THREE.Group {
  const group = new THREE.Group();
  const spotX = -6;
  const spotZ = 31.4;
  group.position.set(spotX, terrainHeight(spotX, spotZ) + 0.02, spotZ);
  boxOn(group, [2.0, 0.03, 1.0], kit.mat("#ff8fab"), [-1.3, 0, 0]);
  boxOn(group, [2.0, 0.03, 1.0], kit.mat("#4dd4c6"), [1.3, 0, 0]);
  addLyingPerson(kit, group, 3, [-1.3, 0.03, 0], Math.PI / 2, { itemId: "beachSpot", worldSpot: group.position.clone().add(new THREE.Vector3(-1.3, 0, 0.9)) });
  addLyingPerson(kit, group, 4, [1.3, 0.03, 0], -Math.PI / 2, { itemId: "beachSpot", worldSpot: group.position.clone().add(new THREE.Vector3(1.3, 0, 0.9)) });
  cylinderOn(group, [0.05, 0.05], 2.7, 6, kit.mat("#f4f4f4"), [0, 0, -0.9]);
  addMesh(group, new THREE.ConeGeometry(1.9, 0.7, 8), kit.mat("#ff7b54"), [0, 2.65, -0.9]);
  addMesh(group, new THREE.ConeGeometry(0.9, 0.34, 8), kit.mat("#ffffff"), [0, 2.88, -0.9]);
  addMesh(group, new THREE.SphereGeometry(0.3, 10, 8), kit.mat("#ffd166"), [3.0, 0.3, 0.8]);
  boxOn(group, [0.7, 0.45, 0.45], kit.mat("#2d6cdf"), [-3.0, 0, -0.5]);
  addMesh(group, new THREE.CapsuleGeometry(0.3, 2.0, 4, 8), kit.mat("#ffd23f"), [3.6, 0.1, -0.6], [Math.PI / 2, 0, 0.3]).scale.set(1, 1, 0.25);

  return group;
}

/** Đàn cá bơi vòng ở chỗ nước cạn quanh đảo, thấy qua mặt nước trong */
export function buildFishSchools(kit: EstateKit, scene: THREE.Scene): void {
  const colors = ["#ff8a3d", "#ffd23f", "#4dabf7", "#ff6b9a"];
  const random = createSeededRandom(31);
  const schools: [number, number][] = [[0.3, 1.4], [0.55, 1.36], [0.85, 1.42], [1.25, 1.4], [1.7, 1.42]];

  schools.forEach(([turns, ring], schoolIndex) => {
    const angle = turns * Math.PI;
    const wobble = shoreWobble(angle);
    const center = new THREE.Vector3(ISLAND_RADIUS_X * ring * wobble * Math.cos(angle), 0, ISLAND_RADIUS_Z * ring * wobble * Math.sin(angle));
    const color = colors[schoolIndex % colors.length];
    const material = kit.mat(color, { emissive: color, emissiveIntensity: 0.25 });

    for (let i = 0; i < 7; i++) {
      const fish = new THREE.Group();
      addMesh(fish, new THREE.SphereGeometry(0.28, 8, 6), material, [0, 0, 0], [0, 0, 0], false).scale.set(1.7, 0.75, 0.5);
      const tail = new THREE.Group();
      tail.position.x = -0.42;
      addMesh(tail, new THREE.ConeGeometry(0.2, 0.34, 4), material, [-0.12, 0, 0], [0, 0, Math.PI / 2], false);
      fish.add(tail);
      scene.add(fish);
      kit.motion.fishes.push({
        fish,
        tail,
        center,
        radius: 1.6 + random() * 2.4,
        speed: 0.45 + random() * 0.3,
        offset: i * 0.85 + random() * 0.3,
        depth: -0.4 - random() * 0.45,
      });
    }
  });
}
