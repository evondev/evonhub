import type * as THREE from "three";

/** Một món trên đảo: nhà theo bậc, xe, thuyền, đồ bay, người */
export interface EstateItemInfo {
  id: string;
  /** Dòng nào ở danh sách món; null là không hiện ở danh sách (nhà, người, biển báo) */
  listId: string | null;
  name: string;
  /** Bậc mở món này */
  tier: number;
  /** Bậc cuối còn giữ món này; bậc sau đó nó được thay bằng bản lớn hơn */
  untilTier: number;
  isHouse: boolean;
}

/** Một dòng ở danh sách món bên cạnh cảnh 3D */
export interface EstateListRow {
  listId: string;
  name: string;
  tier: number;
}

export type EstateItemMode = "owned" | "ghost" | "hidden";

export type EstateSeason = "spring" | "summer" | "autumn" | "winter";

/** Mùa và dịp lễ của ngày đang xem */
export interface EstateOccasions {
  season: EstateSeason;
  isChristmas: boolean;
  isTet: boolean;
  isMidAutumn: boolean;
}

/** Món vừa bấm trong cảnh, kèm toạ độ màn hình để đặt nhãn */
export interface EstatePickedItem {
  name: string;
  tier: number;
  isGhost: boolean;
  clientX: number;
  clientY: number;
}

export interface EstateSceneCallbacks {
  /** null: bấm vào chỗ trống, ẩn nhãn */
  onPick: (item: EstatePickedItem | null) => void;
  /** Lên bậc lúc mở trang: tên các món vừa mở */
  onCelebrate: (itemNames: string[]) => void;
  /** Chớp loé: sau delaySeconds thì phát tiếng sấm, strength 0..1 */
  onThunder: (delaySeconds: number, strength: number) => void;
}

export interface EstateSceneOptions {
  container: HTMLElement;
  tierLevel: number;
  isNight: boolean;
  isLite: boolean;
  isReducedMotion: boolean;
  /** Bậc lần trước máy này đã xem; nhỏ hơn tierLevel thì chạy cảnh lên bậc */
  celebrateFromTier: number | null;
  /** Chữ trên biển báo khi chưa có bậc nào */
  signLines: string[];
  occasions: EstateOccasions;
  callbacks: EstateSceneCallbacks;
}

export interface EstateSceneHandle {
  setGhost: (isGhost: boolean) => void;
  setNight: (isNight: boolean) => void;
  setAutoRotate: (isAutoRotate: boolean) => void;
  setStorm: (isStorm: boolean) => void;
  dispose: () => void;
}

/** Chủ nhà hiện trên thẻ đầu trang */
export interface HouseOwner {
  username: string;
  name: string;
  avatar: string;
}

export interface HousePageData {
  owner: HouseOwner;
  tierLevel: number;
  totalSeconds: number;
  isOwnHouse: boolean;
  /** Dev xem thử mùa và dịp: "2026-12-24"; null là hôm nay */
  previewDateKey: string | null;
}

/* Kiểu nội bộ của engine Three.js */

export type Vec3 = [number, number, number];

export interface FloatingBody {
  group: THREE.Group;
  phase: number;
  baseRotationY: number;
}

export interface SwayingPalm {
  crown: THREE.Group;
  phase: number;
}

export interface PersonLimbs {
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
}

export interface PersonRig {
  group: THREE.Group;
  limbs: PersonLimbs;
}

export interface Jogger extends PersonRig {
  angle: number;
  speed: number;
  phase: number;
}

export interface SwimmingFish {
  fish: THREE.Group;
  tail: THREE.Group;
  center: THREE.Vector3;
  radius: number;
  speed: number;
  offset: number;
  depth: number;
}

export interface GullWing {
  wing: THREE.Group;
  side: number;
}

export interface Gull {
  gull: THREE.Group;
  wings: GullWing[];
  radius: number;
  height: number;
  speed: number;
  phase: number;
}

export type ShelterState = "home" | "running" | "inside" | "returning";

/**
 * Một người trú mưa. runner là người đứng chạy trong toạ độ thế giới; người nằm
 * hay người tập thì runner là bản sao đứng, còn seated là dáng gốc ẩn đi khi vắng nhà.
 */
export interface ShelterAgent {
  itemId: string;
  runner: PersonRig;
  seated: THREE.Object3D | null;
  /** Chỗ quay về khi tạnh mưa */
  homeSpot: () => THREE.Vector3;
  isJogger: boolean;
  state: ShelterState;
  delay: number;
}

export interface DriftingCloud {
  cloud: THREE.Group;
  speed: number;
}

/** Mọi thứ chuyển động, builder đẩy vào đây để vòng lặp cập nhật */
export interface EstateMotion {
  floating: FloatingBody[];
  flames: THREE.Mesh[];
  palms: SwayingPalm[];
  joggers: Jogger[];
  exercisers: PersonRig[];
  fishes: SwimmingFish[];
  clouds: DriftingCloud[];
  gulls: Gull[];
  shelterAgents: ShelterAgent[];
  /** Đèn nhấp nháy, đèn lồng của dịp lễ: sáng hơn buổi tối */
  festiveLights: THREE.MeshStandardMaterial[];
  /** Đèn ông sao Trung thu xoay chậm */
  spinners: THREE.Object3D[];
}

export interface EstateKit {
  mat: (
    color: string,
    options?: THREE.MeshStandardMaterialParameters,
  ) => THREE.MeshStandardMaterial;
  windowMat: THREE.MeshStandardMaterial;
  lampMat: THREE.MeshStandardMaterial;
  headlightMat: THREE.MeshStandardMaterial;
  poolWaterMat: THREE.MeshStandardMaterial;
  flameMat: THREE.MeshStandardMaterial;
  padLightMat: THREE.MeshStandardMaterial;
  ghostMat: THREE.MeshStandardMaterial;
  motion: EstateMotion;
  occasions: EstateOccasions;
}

/** Món đã dựng trong cảnh */
export interface EstateSceneItem {
  info: EstateItemInfo;
  group: THREE.Group;
  focus: THREE.Vector3;
  mode: EstateItemMode | "unset";
}

export interface FireworkBurst {
  points: THREE.Points;
  velocities: THREE.Vector3[];
  origin: THREE.Vector3;
  start: number;
  life: number;
}
