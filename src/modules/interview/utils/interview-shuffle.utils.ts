/** Băm chuỗi thành số 32 bit (FNV-1a), làm hạt giống cho trộn */
function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

/** Số ngẫu nhiên có hạt giống (mulberry32): cùng hạt giống thì cùng dãy số */
function createSeededRandom(seed: string) {
  let state = hashSeed(seed);

  return function nextRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);

    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Trộn theo hạt giống (thường là userId + questionId): mỗi người một thứ tự đáp án
 * để không chia sẻ được kiểu "câu 5 chọn C", tải lại trang vẫn giữ thứ tự cũ
 */
export function shuffleBySeed<TItem>(items: TItem[], seed: string): TItem[] {
  const nextRandom = createSeededRandom(seed);
  const shuffledItems = [...items];

  for (let i = shuffledItems.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(nextRandom() * (i + 1));
    [shuffledItems[i], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[i],
    ];
  }

  return shuffledItems;
}
