import "server-only";
import { readFile } from "node:fs/promises";
import { apiModules } from "../constants/api-modules";
import type { ApiModuleStatus } from "../types/api-module";
import { evonhubEnvFile } from "./lab-paths";

// Đọc API_MODULES trong .env.local của Evonhub để biết module nào đang chạy qua api/.
export async function readApiModuleStatuses(): Promise<ApiModuleStatus[]> {
  let enabledNames: string[] = [];

  try {
    const envContent = await readFile(evonhubEnvFile, "utf8");
    const apiModulesLine = envContent.split("\n").find((line) => line.trim().startsWith("API_MODULES="));
    const rawValue = apiModulesLine?.split("=")[1] ?? "";
    enabledNames = rawValue.replaceAll('"', "").split(",").map((name) => name.trim()).filter(Boolean);
  } catch {
    enabledNames = [];
  }

  return apiModules.map((apiModule) => ({ ...apiModule, isEnabled: enabledNames.includes(apiModule.name) }));
}
