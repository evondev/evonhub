import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    environment: "node",
    // Constants đọc env ngay lúc import nên phải khai báo ở đây
    env: {
      SEPAY_WEBHOOK_TOKEN: "sepay-test-key",
      NEXT_PUBLIC_SEPAY_BANK_ACCOUNT: "33366668888",
      NEXT_PUBLIC_SEPAY_BANK_NAME: "ACB",
    },
    include: ["src/**/*.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
});
