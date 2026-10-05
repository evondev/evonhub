import { cn } from "@/shared/utils";

import { ProductMark } from "./product-mark";

interface ProductLogoProps {
  className?: string;
}

// Ô logo 32px nền màu nhấn, dấu trắng 20px. Đổi --primary là logo đổi theo.
export default function ProductLogo({ className }: ProductLogoProps) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground",
        className,
      )}
    >
      <ProductMark className="size-5" />
    </span>
  );
}
