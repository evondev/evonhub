import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { ESTATE_ITEMS, ESTATE_SILENT_ITEM_IDS } from "../constants/estate.constants";
import type {
  EstateItemMode,
  EstateKit,
  EstateSceneHandle,
  EstateSceneItem,
  EstateSceneOptions,
  Vec3,
} from "../types/estate.types";
import { isEstateItemOwned } from "../utils/estate.utils";
import { buildBalloon, buildHelipad, buildJet, buildRainbow, BALLOON_HEIGHT } from "./estate-aircraft";
import { buildBigYacht, buildDock, buildDockHead, buildSmallYacht, buildSpeedboat } from "./estate-boats";
import { buildFestiveDecor, buildMoon } from "./estate-festive";
import { createFireflies } from "./estate-fireflies";
import { createFireworks } from "./estate-fireworks";
import { buildBeachVilla, buildCabin, buildCottage, buildMansion, buildModernVilla, buildTent, buildTownhouse } from "./estate-houses";
import { createEstateKit } from "./estate-kit";
import { DOCK, HILL, HOME_SPOT_DOOR_OFFSETS, HOME_TARGET, HOUSE_SPOT, JOG_RING } from "./estate-layout";
import { buildBeachSpot, buildExerciser, buildFishSchools, buildJogger } from "./estate-life";
import { buildCampfire, buildClouds, buildEmptySign, buildGarden, buildGulls, buildPool, buildScenery } from "./estate-scenery";
import { createSeasonEffects } from "./estate-seasons";
import { createShelter } from "./estate-shelter";
import { createStorm, STORM_LET_OUT_LEVEL } from "./estate-storm";
import { buildFoam, buildIsland, buildSea, ringPoint } from "./estate-terrain";
import { buildBike, buildCompactCar, buildScooter, buildSupercar } from "./estate-vehicles";

interface ItemBuildSpec {
  build: (kit: EstateKit, options: EstateSceneOptions) => THREE.Group;
  /** Điểm camera bay tới khi món này vừa mở */
  focus: Vec3;
}

const HOUSE_FOCUS: Vec3 = [-3, 6, -6];
const JOGGER_FOCUS: Vec3 = [0, 2, 30];

const ITEM_BUILDERS: Record<string, ItemBuildSpec> = {
  sign: { build: (kit, options) => buildEmptySign(kit, options.signLines), focus: [-3, 3, -2] },
  tent: { build: buildTent, focus: HOUSE_FOCUS },
  cabin: { build: buildCabin, focus: HOUSE_FOCUS },
  cottage: { build: buildCottage, focus: HOUSE_FOCUS },
  townhouse: { build: buildTownhouse, focus: HOUSE_FOCUS },
  modernVilla: { build: buildModernVilla, focus: HOUSE_FOCUS },
  beachVilla: { build: buildBeachVilla, focus: HOUSE_FOCUS },
  mansion: { build: buildMansion, focus: [-3, 9, -4] },
  campfire: { build: buildCampfire, focus: [12, 2, 13] },
  bike: { build: buildBike, focus: [-23.6, 2, 9] },
  jogger1: { build: (kit) => buildJogger(kit, "jogger1", 0, 1.3, 0.07), focus: JOGGER_FOCUS },
  scooter: { build: buildScooter, focus: [-20.8, 2, 9] },
  exerciser: { build: buildExerciser, focus: [2, 3, 17] },
  car: { build: buildCompactCar, focus: [-16.8, 2, 9] },
  beachSpot: { build: buildBeachSpot, focus: [-6, 2, 31] },
  balloon: { build: buildBalloon, focus: [HILL.centerX, BALLOON_HEIGHT, HILL.centerZ] },
  dock: { build: buildDock, focus: [45, 2, 6] },
  jogger2: { build: (kit) => buildJogger(kit, "jogger2", 1, 3.6, 0.06), focus: JOGGER_FOCUS },
  speedboat: { build: buildSpeedboat, focus: [46.5, 1, 9.6] },
  pool: { build: (kit) => buildPool(kit, false), focus: [13.5, 2, -3.8] },
  supercar: { build: (kit) => buildSupercar(kit, -12.4, "#e5322d", false), focus: [-12.4, 2, 9] },
  garden: { build: buildGarden, focus: [8, 3, 4] },
  yachtSmall: { build: buildSmallYacht, focus: [55, 2, 10.8] },
  dockHead: { build: buildDockHead, focus: [62, 2, 10] },
  poolInfinity: { build: (kit) => buildPool(kit, true), focus: [15.5, 2, -3.8] },
  supercar2: { build: (kit) => buildSupercar(kit, -8.2, "#f6c21c", true), focus: [-8.2, 2, 9] },
  yachtBig: { build: buildBigYacht, focus: [54, 4, 17.6] },
  jogger3: { build: (kit) => buildJogger(kit, "jogger3", 4, 5.2, 0.08), focus: JOGGER_FOCUS },
  heli: { build: buildHelipad, focus: [17, 3, -17] },
  jet: { build: buildJet, focus: [0, 6, 0] },
  rainbow: { build: () => buildRainbow(), focus: [-40, 30, -60] },
};

const FRAME_INTERVAL = 1 / 30;
const FLIGHT_SECONDS = 1.6;

function createGradientTexture(top: string, bottom: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 2, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

function easeOutBack(progress: number): number {
  const overshoot = 1.70158;

  return 1 + (overshoot + 1) * Math.pow(progress - 1, 3) + overshoot * Math.pow(progress - 1, 2);
}

function easeInOut(progress: number): number {
  return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

/**
 * Dựng đảo của một người vào khung chứa. Bậc cố định suốt trang; người xem chỉ
 * xoay camera, bấm món, bật xem trước bậc kế, đổi ngày đêm.
 */
export function createEstateScene(options: EstateSceneOptions): EstateSceneHandle {
  const { container, tierLevel, isLite, isReducedMotion, callbacks } = options;
  const motionScale = isReducedMotion ? 0 : 1;
  const kit = createEstateKit(options.occasions);

  /* Renderer, cảnh, camera */
  const renderer = new THREE.WebGLRenderer({ antialias: !isLite });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLite ? 1 : 1.5));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = isLite ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.touchAction = "none";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / Math.max(1, container.clientHeight), 0.5, 4000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 22;
  controls.maxDistance = 260;
  controls.maxPolarAngle = 1.38;
  controls.enablePan = false;
  controls.autoRotate = !isReducedMotion;
  controls.autoRotateSpeed = 0.35;

  /* Trời, sương, đèn */
  const daySky = createGradientTexture("#5fb6ea", "#fbe6c6");
  const nightSky = createGradientTexture("#060d24", "#28406b");
  const stormSky = createGradientTexture("#5d6b78", "#a3adb5");
  scene.background = daySky;
  const fog = new THREE.Fog("#d6ecf2", 160, 620);
  scene.fog = fog;
  const hemiLight = new THREE.HemisphereLight("#e2f4ff", "#6f8f52", 1.0);
  const sun = new THREE.DirectionalLight("#fff0d4", 2.7);
  sun.position.set(70, 95, 45);
  sun.target.position.set(10, 0, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.setScalar(isLite ? 1024 : 2048);
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.05;
  Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 60, bottom: -60, near: 10, far: 260 });
  const porchLight = new THREE.PointLight("#ffc977", 0, 26, 1.6);
  porchLight.position.set(-3, 5, 4);
  const dockLight = new THREE.PointLight("#ffc977", 0, 22, 1.6);
  dockLight.position.set(DOCK.endX - 2, 4.5, DOCK.centerZ);
  const fireLight = new THREE.PointLight("#ff8a2a", 0, 14, 1.8);
  fireLight.position.set(12, 2.6, 13);
  scene.add(hemiLight, sun, sun.target, porchLight, dockLight, fireLight);

  /* Đảo, biển, cảnh có sẵn */
  buildIsland(scene);
  const seaParts = buildSea(scene);
  const foam = buildFoam(scene);
  buildScenery(kit, scene);
  const cloudMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", flatShading: true, roughness: 1, emissive: "#ffffff", emissiveIntensity: 0.15 });
  buildClouds(kit, scene, cloudMaterial);
  buildGulls(kit, scene);
  buildFishSchools(kit, scene);
  const fireworks = createFireworks(scene);
  const fireflies = createFireflies(scene);
  const seasonEffects = createSeasonEffects(scene, kit);
  buildFestiveDecor(kit, scene);
  const moon = buildMoon(scene, options.occasions.isMidAutumn);
  const storm = createStorm(scene, isLite, callbacks.onThunder);

  /* Dựng mọi món, chỉ hiện món đúng bậc */
  const items: EstateSceneItem[] = ESTATE_ITEMS.map((info) => {
    const spec = ITEM_BUILDERS[info.id];
    const group = spec.build(kit, options);
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.itemId = info.id;
        child.userData.originalMaterial = child.material;
        child.userData.castsShadow = child.castShadow;
      }
    });
    group.userData.baseScale = group.scale.clone();
    scene.add(group);

    return { info, group, focus: new THREE.Vector3(...spec.focus), mode: "unset" };
  });
  const findItem = (itemId: string) => items.find((item) => item.info.id === itemId);
  const campfireItem = findItem("campfire");
  const balloonGroup = findItem("balloon")?.group;
  const rotor = findItem("heli")?.group.getObjectByName("rotor");
  const flag = findItem("mansion")?.group.getObjectByName("flag");
  const jetGroup = findItem("jet")?.group;
  const rainbowGroup = findItem("rainbow")?.group;
  // Bản đứng của người nằm, người tập: gắn thẳng vào cảnh để chạy theo toạ độ thế giới.
  kit.motion.shelterAgents.filter((agent) => !agent.isJogger).forEach((agent) => scene.add(agent.runner.group));
  const ownedHouse = items.find((item) => item.info.isHouse && isEstateItemOwned(item.info, tierLevel));
  const door = ownedHouse ? HOUSE_SPOT.clone().add(new THREE.Vector3(0, 0, HOME_SPOT_DOOR_OFFSETS[ownedHouse.info.id] || 3)) : null;
  const shelter = createShelter({
    agents: kit.motion.shelterAgents,
    isItemOwned: (itemId) => findItem(itemId)?.mode === "owned",
    getDoor: () => door,
  });
  let isStormActive = false;
  let isLetOutPending = false;
  let stormAmount = 0;

  function setItemMode(item: EstateSceneItem, mode: EstateItemMode): void {
    if (item.mode === mode) return;

    item.mode = mode;
    item.group.visible = mode !== "hidden";
    item.group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = mode === "ghost" ? kit.ghostMat : child.userData.originalMaterial;
      child.castShadow = mode === "owned" && child.userData.castsShadow;
    });
  }

  // Xem trước bậc kế: món của bậc kế hiện mờ; nhà hay món sắp được thay thì nhường chỗ.
  function applyItemModes(isGhost: boolean): void {
    const nextLevel = tierLevel + 1;
    const isGhostShown = isGhost && nextLevel <= 10;
    const isHouseReplaced = isGhostShown && items.some((item) => item.info.isHouse && item.info.tier === nextLevel);

    items.forEach((item) => {
      let mode: EstateItemMode = isEstateItemOwned(item.info, tierLevel) ? "owned" : "hidden";
      const isReplacedNext =
        item.info.untilTier === tierLevel &&
        item.info.listId !== null &&
        items.some((other) => other.info.listId === item.info.listId && other.info.tier === nextLevel);

      if (isGhostShown && item.info.tier === nextLevel) mode = "ghost";
      if (isHouseReplaced && item.info.isHouse && mode === "owned") mode = "hidden";
      if (isGhostShown && mode === "owned" && isReplacedNext) mode = "hidden";
      setItemMode(item, mode);
    });
  }

  applyItemModes(false);

  /* Camera: bậc thấp đứng gần, bậc cao lùi xa; màn dọc lùi thêm cho khỏi cắt đảo */
  const portraitFactor = () => Math.max(1, 1.15 / camera.aspect);
  const viewDirection = new THREE.Vector3(0.5, 0.42, 0.76).normalize();

  function frameCamera(): void {
    const distance = (tierLevel <= 2 ? 62 : tierLevel <= 5 ? 88 : 118) * portraitFactor();
    const target = tierLevel <= 2 ? new THREE.Vector3(-6, 3, 0) : HOME_TARGET.clone();
    controls.target.copy(target);
    camera.position.copy(target).add(viewDirection.clone().multiplyScalar(distance));
  }

  frameCamera();

  const clock = new THREE.Clock();
  const pops: { item: EstateSceneItem; start: number }[] = [];
  const flight = {
    isActive: false,
    start: 0,
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
    fromPosition: new THREE.Vector3(),
    toPosition: new THREE.Vector3(),
  };

  function flyTo(focus: THREE.Vector3): void {
    flight.isActive = true;
    flight.start = clock.elapsedTime;
    flight.fromTarget.copy(controls.target);
    flight.toTarget.copy(focus);
    flight.fromPosition.copy(camera.position);
    const direction = camera.position.clone().sub(controls.target).normalize();
    flight.toPosition.copy(focus).add(direction.multiplyScalar(58 * portraitFactor()));
    flight.toPosition.y = Math.max(flight.toPosition.y, focus.y + 14);
  }

  /* Lên bậc so với lần xem trước: món mới nảy lên, pháo hoa, camera bay tới */
  const fromTier = options.celebrateFromTier;

  if (fromTier !== null && fromTier < tierLevel) {
    const newItems = items.filter((item) => item.mode === "owned" && item.info.tier > fromTier);

    if (newItems.length) {
      const startAt = 0.6;
      newItems.forEach((item, index) => {
        if (isReducedMotion) return;
        item.group.scale.setScalar(0.001);
        pops.push({ item, start: startAt + index * 0.18 });
      });
      const hero = newItems.find((item) => item.info.isHouse) || newItems[newItems.length - 1];
      window.setTimeout(() => flyTo(hero.focus), startAt * 1000);

      if (!isReducedMotion) {
        for (let i = 0; i < 3; i++) {
          fireworks.launch(hero.focus.clone().add(new THREE.Vector3((i - 1) * 7, 16 + i * 3, 0)), startAt + 0.4 + i * 0.35);
        }
      }
      callbacks.onCelebrate(newItems.filter((item) => !ESTATE_SILENT_ITEM_IDS.includes(item.info.id)).map((item) => item.info.name));
    }
  }

  /* Ngày đêm */
  let isNight = false;
  const lightBase = { hemi: 1, sun: 2.7 };
  const dayFogColor = new THREE.Color("#d6ecf2");
  const nightFogColor = new THREE.Color("#1a2a4a");
  const stormFogColor = new THREE.Color("#8d99a3");

  function applyNight(nextIsNight: boolean): void {
    isNight = nextIsNight;
    lightBase.hemi = isNight ? 0.45 : 1.0;
    lightBase.sun = isNight ? 0.55 : 2.7;
    moon.visible = isNight;
    hemiLight.color.set(isNight ? "#5a6fa8" : "#e2f4ff");
    hemiLight.groundColor.set(isNight ? "#1c2a1f" : "#6f8f52");
    sun.color.set(isNight ? "#a9bcff" : "#fff0d4");
    sun.position.set(isNight ? -60 : 70, isNight ? 80 : 95, isNight ? 30 : 45);
    kit.lampMat.emissiveIntensity = isNight ? 2.4 : 0.2;
    kit.headlightMat.emissiveIntensity = isNight ? 1.2 : 0;
    kit.poolWaterMat.emissiveIntensity = isNight ? 0.9 : 0.12;
    kit.padLightMat.emissiveIntensity = isNight ? 2.2 : 0.3;
    seaParts.seaMaterial.color.set(isNight ? "#123e63" : "#22b4c9");
    seaParts.farSeaMaterial.color.set(isNight ? "#0f2b4a" : "#1f8fae");
    cloudMaterial.color.set(isNight ? "#3b4a6b" : "#ffffff");
    rainbowGroup?.children.forEach((band) => {
      ((band as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = isNight ? 0 : 0.5;
    });
  }

  // Bão làm trời sầm, sương dày, đèn cửa sổ bật như chập tối; đêm thì giữ trời đêm.
  function applyWeather(): void {
    hemiLight.intensity = lightBase.hemi * (1 - 0.55 * stormAmount);
    sun.intensity = lightBase.sun * (1 - 0.75 * stormAmount);
    scene.background = isNight ? nightSky : stormAmount > 0.45 ? stormSky : daySky;
    fog.color.copy(isNight ? nightFogColor : dayFogColor).lerp(stormFogColor, isNight ? stormAmount * 0.3 : stormAmount);
    fog.far = THREE.MathUtils.lerp(620, 240, stormAmount);
    kit.windowMat.emissiveIntensity = Math.max(isNight ? 1.5 : 0, stormAmount * 0.9);
    seaParts.stormUniform.value = stormAmount;
    fireflies.points.visible = isNight && stormAmount < 0.1;
  }

  applyNight(options.isNight);
  applyWeather();

  /* Bấm vào một món: báo lên để giao diện hiện nhãn */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerDownAt: { clientX: number; clientY: number } | null = null;

  function handlePointerDown(event: PointerEvent): void {
    pointerDownAt = { clientX: event.clientX, clientY: event.clientY };
  }

  function handlePointerUp(event: PointerEvent): void {
    if (!pointerDownAt) return;

    const dragDistance = Math.hypot(event.clientX - pointerDownAt.clientX, event.clientY - pointerDownAt.clientY);
    pointerDownAt = null;

    if (dragDistance > 6) return;

    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const visibleGroups = items.filter((item) => item.mode !== "hidden").map((item) => item.group);
    const hit = raycaster.intersectObjects(visibleGroups, true)[0];
    const pickedItem = hit ? findItem(hit.object.userData.itemId) : undefined;

    if (!pickedItem || pickedItem.info.id === "sign") {
      callbacks.onPick(null);
      return;
    }

    callbacks.onPick({
      name: pickedItem.info.name,
      tier: pickedItem.info.tier,
      isGhost: pickedItem.mode === "ghost",
      clientX: event.clientX - bounds.left,
      clientY: event.clientY - bounds.top,
    });
  }

  function handleControlsStart(): void {
    flight.isActive = false;
  }

  renderer.domElement.addEventListener("pointerdown", handlePointerDown);
  renderer.domElement.addEventListener("pointerup", handlePointerUp);
  controls.addEventListener("start", handleControlsStart);

  const resizeObserver = new ResizeObserver(() => {
    const width = container.clientWidth;
    const height = Math.max(1, container.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  /* Vòng lặp: khoá 30 khung hình mỗi giây, ngừng hẳn khi tab ẩn */
  let lastFrameAt = 0;
  const { motion } = kit;

  function updateMotion(time: number, delta: number): void {
    seaParts.timeUniform.value = time * motionScale;
    foam.material.opacity = (isNight ? 0.22 : 0.45) + Math.sin(time * 1.4) * 0.12 * motionScale;

    motion.floating.forEach(({ group, phase, baseRotationY }) => {
      group.position.y = Math.sin(time * 1.1 + phase) * 0.12 * motionScale;
      group.rotation.z = Math.sin(time * 0.9 + phase) * 0.025 * motionScale;
      group.rotation.y = baseRotationY + Math.sin(time * 0.3 + phase) * 0.02 * motionScale;
    });
    motion.palms.forEach(({ crown, phase }) => {
      const sway = 1 + stormAmount * 3;
      crown.rotation.z = Math.sin(time * (0.8 + stormAmount * 2) + phase) * 0.05 * sway * motionScale;
      crown.rotation.x = Math.cos(time * (0.6 + stormAmount * 2) + phase) * 0.04 * sway * motionScale;
    });
    motion.flames.forEach((flame, index) => {
      flame.scale.y = (1 + Math.sin(time * 9 + index * 2) * 0.18) * (1 - stormAmount * 0.85);
      flame.scale.x = flame.scale.z = 1 + Math.cos(time * 7 + index) * 0.1;
    });
    fireLight.intensity = campfireItem?.mode === "owned" ? (isNight ? 26 : 3) * (0.85 + Math.sin(time * 11) * 0.15) * (1 - stormAmount) : 0;
    porchLight.intensity = isNight && tierLevel > 0 ? 40 : 0;
    dockLight.intensity = isNight && tierLevel >= 4 ? 30 : 0;

    if (balloonGroup) {
      balloonGroup.position.y = BALLOON_HEIGHT + Math.sin(time * 0.5) * 1.2 * motionScale;
      balloonGroup.rotation.y = time * 0.05 * motionScale;
    }
    if (rotor) rotor.rotation.y = time * 0.6 * motionScale;
    if (flag) flag.rotation.y = Math.sin(time * 2.4) * 0.25 * motionScale;
    if (jetGroup) {
      const jetAngle = time * 0.11 * motionScale + 1.2;
      jetGroup.position.set(Math.cos(jetAngle) * 62 + 8, 30 + Math.sin(time * 0.3) * 2 * motionScale, Math.sin(jetAngle) * 52 - 4);
      jetGroup.rotation.set(0, -jetAngle - Math.PI, 0);
    }

    motion.clouds.forEach((drifting) => {
      drifting.cloud.position.x += drifting.speed * delta * motionScale;
      if (drifting.cloud.position.x > 320) drifting.cloud.position.x = -320;
    });
    motion.gulls.forEach(({ gull, wings, radius, height, speed, phase }) => {
      const angle = time * speed + phase;
      gull.position.set(Math.cos(angle) * radius + 4, height + Math.sin(time + phase) * 1.5, Math.sin(angle) * radius);
      gull.rotation.y = -angle;
      wings.forEach(({ wing, side }) => {
        wing.rotation.x = side * (0.3 + Math.sin(time * 6 + phase) * 0.45 * motionScale);
      });
      gull.visible = !isNight && stormAmount < 0.2;
    });
    motion.joggers.forEach((jogger) => {
      if (shelter.isAway(jogger)) return;
      jogger.angle += jogger.speed * delta * motionScale;
      const step = time * 9 + jogger.phase;
      const point = ringPoint(jogger.angle, JOG_RING);
      const ahead = ringPoint(jogger.angle + 0.02, JOG_RING);
      jogger.group.position.copy(point);
      jogger.group.position.y += Math.abs(Math.sin(step)) * 0.08 * motionScale;
      jogger.group.lookAt(ahead.x, point.y, ahead.z);
      jogger.limbs.leftLeg.rotation.x = Math.sin(step) * 0.75 * motionScale;
      jogger.limbs.rightLeg.rotation.x = -Math.sin(step) * 0.75 * motionScale;
      jogger.limbs.leftArm.rotation.x = -Math.sin(step) * 0.8 * motionScale;
      jogger.limbs.rightArm.rotation.x = Math.sin(step) * 0.8 * motionScale;
    });
    motion.exercisers.forEach(({ group, limbs }) => {
      const spread = ((Math.sin(time * 5) + 1) / 2) * motionScale;
      limbs.leftArm.rotation.z = -(0.15 + spread * 2.6);
      limbs.rightArm.rotation.z = 0.15 + spread * 2.6;
      limbs.leftLeg.rotation.z = -spread * 0.3;
      limbs.rightLeg.rotation.z = spread * 0.3;
      group.position.y = 0.05 + Math.abs(Math.sin(time * 5)) * 0.12 * motionScale;
    });
    motion.fishes.forEach(({ fish, tail, center, radius, speed, offset, depth }) => {
      const angle = time * speed * motionScale + offset;
      fish.position.set(center.x + Math.cos(angle) * radius, depth + Math.sin(time * 2 + offset) * 0.05, center.z + Math.sin(angle) * radius);
      fish.rotation.y = Math.atan2(-Math.cos(angle), -Math.sin(angle));
      tail.rotation.y = Math.sin(time * 10 + offset) * 0.45 * motionScale;
    });
  }

  function updateFestive(time: number): void {
    motion.festiveLights.forEach((material, index) => {
      const blink = 0.55 + 0.45 * Math.sin(time * 2.2 + index * 1.7);
      material.emissiveIntensity = (isNight ? 2.2 : 0.7) * (motionScale ? blink : 1);
    });
    motion.spinners.forEach((spinner) => {
      spinner.rotation.y = time * 0.6 * motionScale;
    });
  }

  function tick(): void {
    const now = performance.now() / 1000;

    if (now - lastFrameAt < FRAME_INTERVAL - 0.002) return;

    lastFrameAt = now;
    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;
    stormAmount = storm.update(delta, time);

    if (isLetOutPending && stormAmount < STORM_LET_OUT_LEVEL) {
      isLetOutPending = false;
      shelter.letEveryoneOut();
    }

    applyWeather();
    updateMotion(time, delta);
    shelter.update(delta, time, motionScale);
    seasonEffects.update(time, delta, motionScale, stormAmount);
    updateFestive(time);

    for (let index = pops.length - 1; index >= 0; index--) {
      const pop = pops[index];
      const progress = (time - pop.start) / 0.75;

      if (progress < 0) continue;

      const scale = progress >= 1 ? 1 : Math.max(0.001, easeOutBack(progress));
      pop.item.group.scale.copy(pop.item.group.userData.baseScale).multiplyScalar(scale);

      if (progress >= 1) pops.splice(index, 1);
    }
    fireworks.update(time);

    if (isNight) fireflies.update(time, motionScale);

    if (flight.isActive) {
      const eased = easeInOut(Math.min(1, (time - flight.start) / FLIGHT_SECONDS));
      controls.target.lerpVectors(flight.fromTarget, flight.toTarget, eased);
      camera.position.lerpVectors(flight.fromPosition, flight.toPosition, eased);

      if (eased >= 1) flight.isActive = false;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  function handleVisibilityChange(): void {
    renderer.setAnimationLoop(document.hidden ? null : tick);
  }

  renderer.setAnimationLoop(tick);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  return {
    setGhost: (isGhost) => applyItemModes(isGhost),
    setNight: (nextIsNight) => applyNight(nextIsNight),
    setStorm: (isStorm) => {
      if (isStorm === isStormActive) return;

      isStormActive = isStorm;
      storm.setActive(isStorm, clock.elapsedTime);

      if (isStorm) {
        isLetOutPending = false;
        shelter.sendEveryoneInside();
      } else {
        isLetOutPending = true;
      }
    },
    setAutoRotate: (isAutoRotate) => {
      controls.autoRotate = isAutoRotate && !isReducedMotion;
    },
    dispose: () => {
      renderer.setAnimationLoop(null);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      controls.removeEventListener("start", handleControlsStart);
      resizeObserver.disconnect();
      controls.dispose();
      fireworks.dispose();
      fireflies.dispose();
      seasonEffects.dispose();
      storm.dispose();
      stormSky.dispose();
      // Món đang ở chế độ bóng mờ: trả vật liệu gốc để vòng dọn bên dưới gặp đủ.
      items.forEach((item) => setItemMode(item, "hidden"));
      const materials = new Set<THREE.Material>([kit.ghostMat, cloudMaterial]);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
        objectMaterials.forEach((material: THREE.Material) => materials.add(material));
      });
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial) material.map?.dispose();
        material.dispose();
      });
      daySky.dispose();
      nightSky.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
