import { Info } from "lucide-react";

/**
 * Khóa miễn phí đi đường riêng nên báo trước các bước. Không có nút ✕: trang
 * hướng dẫn đọc một lần, ẩn đi rồi không ai cần hiện lại.
 */
export function HowToBuyFreeBanner() {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-2xl border border-border bg-background p-4"
    >
      <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-muted" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Khóa miễn phí thì không cần các bước dưới đây
        </p>
        <p className="mt-0.5 text-pretty text-sm text-foreground/80">
          Bấm <span className="font-medium text-foreground">Hốt ngay</span> trên
          trang khóa là khóa vào tài khoản, bạn vào học được luôn.
        </p>
      </div>
    </div>
  );
}
