import type { ComponentProps } from "react";

// Dấu của EvonHub: nút play đứng thay dấu > của dòng lệnh, thanh dưới là con trỏ.
// Một màu currentColor, nên màu đến từ chỗ đặt nó.
export function ProductMark(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        d="M5.5 5.5V16.5L15 11Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <rect x="13" y="16.5" width="7" height="3.5" rx="1.25" />
    </svg>
  );
}
