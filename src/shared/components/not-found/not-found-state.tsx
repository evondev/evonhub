import { ProductLogo } from "@/shared/components/product-logo";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { NotFoundActions } from "./not-found-actions";

interface NotFoundStateProps {
  /** Đứng riêng ngoài khung app (sai đường dẫn): thêm logo ở trên */
  isStandalone?: boolean;
}

// Khối 404 căn giữa, không card, nằm thẳng trên nền trang. Trong khung app và
// đứng riêng dùng chung một khối, đứng riêng chỉ thêm logo.
export function NotFoundState({ isStandalone = false }: NotFoundStateProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-md text-center",
        !isStandalone && "pb-16 pt-16 sm:pt-24",
      )}
    >
      {isStandalone && (
        <Link
          href="/"
          aria-label="EvonHub, về trang chủ"
          className="mx-auto mb-8 flex w-fit"
        >
          <ProductLogo className="size-10" />
        </Link>
      )}
      <p className="text-sm font-medium tabular-nums text-muted">404</p>
      <h1 className="mt-1 text-xl font-semibold text-foreground">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 text-pretty text-sm text-muted">
        Đường dẫn có thể bị gõ sai, hoặc trang đã được chuyển sang chỗ khác.
      </p>
      <NotFoundActions />
    </section>
  );
}
