import type { ClerkAppearance } from "@/shared/types";

// Giao diện chung cho form đăng nhập, đăng ký của Clerk. Màu đi qua variables để
// Clerk tự sinh các bậc hover/focus; class trong elements cần `!` vì CSS của Clerk
// chèn lúc chạy, nằm sau Tailwind nên thắng khi cùng độ ưu tiên. Clerk vẽ viền ô
// nhập và nút bằng box-shadow, nên bỏ bóng thì phải kẻ lại bằng border.
export const authAppearance: ClerkAppearance = {
  layout: {
    // Trùng dấu ProductLogo ở sidebar (src/app/icon.svg)
    logoImageUrl: "/icon.svg",
    socialButtonsVariant: "blockButton",
  },
  variables: {
    colorPrimary: "#6c5fe6",
    colorText: "#262626",
    colorTextSecondary: "#6b7079",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#262626",
    fontSize: "0.9375rem",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full max-w-md",
    cardBox: "w-full max-w-none !rounded-2xl !border-0 !shadow-none",
    card: "gap-8 !rounded-none !border-0 px-6 py-8 !shadow-none sm:px-10 sm:py-10",
    logoBox: "h-10 justify-center",
    logoImage: "size-10",
    header: "gap-2",
    headerTitle: "font-display !text-2xl !font-semibold tracking-tight",
    headerSubtitle: "!text-sm",
    socialButtonsBlockButton:
      "!h-12 !rounded-xl !border !border-solid !border-border-strong !shadow-none hover:!bg-item-hover",
    socialButtonsBlockButtonText: "!text-[15px] !font-medium",
    dividerLine: "!bg-border-strong",
    dividerText: "!text-sm",
    formFieldLabel: "!text-sm !font-medium",
    formFieldInput:
      "!h-12 !max-h-none !rounded-xl !border !border-solid !border-border-strong !px-4 !text-[15px] !shadow-none focus:!border-primary focus:!ring-2 focus:!ring-primary/15",
    formButtonPrimary:
      "!h-12 !rounded-xl !bg-primary !text-[15px] !font-semibold normal-case !shadow-none after:!hidden hover:!bg-primary-strong",
    buttonArrowIcon: "hidden",
    footer: "!bg-none !bg-surface border-t border-border-strong",
    footerActionText: "!text-sm",
    // Đệm dọc cho link chữ đủ chỗ chạm trên điện thoại, margin âm giữ nó thẳng hàng với câu bên cạnh
    footerActionLink: "!-my-1 !py-1 !text-sm !font-semibold !text-primary-strong",
  },
};
