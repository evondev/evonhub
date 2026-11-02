import "server-only";
import path from "node:path";

// App chạy trong learn/app, nên gốc repo Evonhub nằm hai cấp trên.
const repoRoot = path.resolve(process.cwd(), "../..");

export const journalDir = path.join(repoRoot, "learn", "journal");
export const evonhubEnvFile = path.join(repoRoot, ".env.local");

// "evonhub-api" là backend thật ở api/; các workspace khác là harness bài lab ở learn/labs/.
export function resolveWorkspaceDir(workspace: string) {
  if (workspace === "evonhub-api") return path.join(repoRoot, "api");

  return path.join(repoRoot, "learn", "labs", workspace);
}
