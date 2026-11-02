import { Database, Plug } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ApiModuleStatus } from "../types/api-module";

interface ApiModuleCardProps {
  moduleStatuses: ApiModuleStatus[];
}

// Phần nào của Evonhub đang chạy qua api/ thay vì Mongoose, đọc từ API_MODULES trong .env.local.
export default function ApiModuleCard({ moduleStatuses }: ApiModuleCardProps) {
  const enabledCount = moduleStatuses.filter((moduleStatus) => moduleStatus.isEnabled).length;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Evonhub đang chạy qua API</p>
        <span className="text-xs text-muted">
          {enabledCount}/{moduleStatuses.length} module
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {moduleStatuses.map((moduleStatus) => (
          <li
            key={moduleStatus.name}
            title={`Bật được sau mốc ${moduleStatus.milestoneNumber}`}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs",
              moduleStatus.isEnabled && "border-primary/30 bg-primary-light text-primary-hover",
              !moduleStatus.isEnabled && "border-border-strong text-muted",
            )}
          >
            {moduleStatus.isEnabled && <Plug className="size-3.5 shrink-0" aria-hidden />}
            {!moduleStatus.isEnabled && <Database className="size-3.5 shrink-0" aria-hidden />}
            {moduleStatus.name} · {moduleStatus.isEnabled ? "API" : "Mongo"}
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted">
        Bật module bằng <code className="rounded bg-background px-1 font-mono">API_MODULES</code> trong .env.local ở gốc
        repo, sau khi mốc của nó xanh.
      </p>
    </div>
  );
}
