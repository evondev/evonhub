/** Tên trang và một câu nói trang này giúp được gì */
export function HowToBuyHeader() {
  return (
    <header>
      <h1 className="text-balance text-xl font-semibold text-foreground">
        Hướng dẫn mua khóa học
      </h1>
      <p className="mt-1 max-w-[60ch] text-pretty text-sm text-muted">
        Bốn bước từ chọn khóa tới vào học. Evonhub nhận thanh toán bằng chuyển
        khoản ngân hàng.
      </p>
    </header>
  );
}
