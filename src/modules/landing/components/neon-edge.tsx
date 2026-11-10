/**
 * Đường sáng mảnh chạy ngang mép trên khối, sáng nhất ở giữa. Khối cha cần
 * "relative"; chỉ để trang trí
 */
export function NeonEdge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-[10%] top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-300/80 to-transparent"
    />
  );
}
