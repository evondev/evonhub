import * as THREE from "three";

import type { Vec3 } from "../types/estate.types";

export const UP_AXIS = new THREE.Vector3(0, 1, 0);

export function smoothstep(edgeStart: number, edgeEnd: number, value: number): number {
  const progress = Math.min(1, Math.max(0, (value - edgeStart) / (edgeEnd - edgeStart)));

  return progress * progress * (3 - 2 * progress);
}

/** Số ngẫu nhiên có hạt giống: cùng hạt thì cùng cảnh mỗi lần dựng */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function addMesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  position: Vec3 = [0, 0, 0],
  rotation: Vec3 = [0, 0, 0],
  castShadow = true,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);

  return mesh;
}

/** Hộp đặt theo đáy: bottomY là mặt dưới, dễ xếp tầng */
export function boxOn(
  parent: THREE.Object3D,
  size: Vec3,
  material: THREE.Material,
  position: Vec3,
  rotationY = 0,
): THREE.Mesh {
  const [width, height, depth] = size;
  const [positionX, bottomY, positionZ] = position;

  return addMesh(
    parent,
    new THREE.BoxGeometry(width, height, depth),
    material,
    [positionX, bottomY + height / 2, positionZ],
    [0, rotationY, 0],
  );
}

export function cylinderOn(
  parent: THREE.Object3D,
  radii: [number, number],
  height: number,
  segments: number,
  material: THREE.Material,
  position: Vec3,
): THREE.Mesh {
  const [positionX, bottomY, positionZ] = position;

  return addMesh(
    parent,
    new THREE.CylinderGeometry(radii[0], radii[1], height, segments),
    material,
    [positionX, bottomY + height / 2, positionZ],
  );
}

/** Thanh tròn nối hai điểm: khung xe đạp, dây khinh khí cầu, đuôi trực thăng */
export function rodBetween(
  parent: THREE.Object3D,
  start: Vec3,
  end: Vec3,
  radius: number,
  material: THREE.Material,
  segments = 6,
): THREE.Mesh {
  const startPoint = new THREE.Vector3(...start);
  const endPoint = new THREE.Vector3(...end);
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, startPoint.distanceTo(endPoint), segments),
    material,
  );
  mesh.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(UP_AXIS, endPoint.clone().sub(startPoint).normalize());
  mesh.castShadow = true;
  parent.add(mesh);

  return mesh;
}

function toShape(points: [number, number][]): THREE.Shape {
  return new THREE.Shape(points.map(([pointX, pointY]) => new THREE.Vector2(pointX, pointY)));
}

/** Biên dạng nhìn ngang (x dọc thân, y cao), đùn theo bề ngang z, căn giữa */
export function sideProfile(
  points: [number, number][],
  width: number,
  bevel = 0.06,
): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(toShape(points), {
    depth: width - bevel * 2,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
  });
  geometry.translate(0, 0, -(width - bevel * 2) / 2);

  return geometry;
}

/** Thót bề ngang theo độ cao: nóc xe hẹp hơn gầm */
export function taperTop<GeometryType extends THREE.BufferGeometry>(
  geometry: GeometryType,
  startY: number,
  endY: number,
  amount: number,
): GeometryType {
  const position = geometry.attributes.position;

  for (let i = 0; i < position.count; i++) {
    position.setZ(i, position.getZ(i) * (1 - amount * smoothstep(startY, endY, position.getY(i))));
  }
  geometry.computeVertexNormals();

  return geometry;
}

/** Viền nhìn từ trên (x dọc, y ngang), đùn lên theo y. bottomScale < 1 thót đáy thành thân thuyền */
export function hullFromOutline(
  points: [number, number][],
  height: number,
  bottomScale = 1,
): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(toShape(points), { depth: height, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);

  if (bottomScale !== 1) {
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      if (position.getY(i) < height * 0.5) {
        position.setZ(i, position.getZ(i) * bottomScale);
        position.setX(i, position.getX(i) * (0.92 + 0.08 * bottomScale));
      }
    }
    geometry.computeVertexNormals();
  }

  return geometry;
}

/** Mái hông: chóp 4 cạnh xoay vuông góc rồi kéo theo hình chữ nhật */
export function hipRoof(width: number, depth: number, height: number): THREE.ConeGeometry {
  const geometry = new THREE.ConeGeometry(Math.SQRT1_2, height, 4, 1);
  geometry.rotateY(Math.PI / 4);
  geometry.scale(width, 1, depth);

  return geometry;
}

/** Mái hai dốc: tam giác đùn theo chiều sâu */
export function gableRoof(width: number, depth: number, rise: number): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(
    toShape([
      [-width / 2, 0],
      [width / 2, 0],
      [0, rise],
    ]),
    { depth, bevelEnabled: false },
  );
  geometry.translate(0, 0, -depth / 2);

  return geometry;
}
