import type { ApiModule } from "../types/api-module";

// Module của Evonhub sẽ chuyển sang api/, bật bằng API_MODULES trong .env.local ở gốc repo.
export const apiModules: ApiModule[] = [
  { name: "me", milestoneNumber: 5 },
  { name: "courses", milestoneNumber: 6 },
  { name: "orders", milestoneNumber: 7 },
  { name: "history", milestoneNumber: 8 },
  { name: "email", milestoneNumber: 9 },
];
