/** 507.786 → "507 nghìn", 1.250.000 → "1,3 triệu" */
export function formatCompactCount(count: number) {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(".", ",")} triệu`;
  }

  if (count >= 1_000) return `${Math.floor(count / 1_000)} nghìn`;

  return String(count);
}
