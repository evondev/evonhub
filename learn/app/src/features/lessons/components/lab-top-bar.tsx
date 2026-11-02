import { GitBranch, GraduationCap } from "lucide-react";

export default function LabTopBar() {
  return (
    <header className="border-b border-border-strong bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2.5 px-4 sm:px-6">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-4" aria-hidden />
        </span>
        <span className="text-sm font-semibold">Evonhub · Học backend</span>
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted sm:flex">
          <GitBranch className="size-3.5" aria-hidden />
          learn/nest-api · 127.0.0.1
        </span>
      </div>
    </header>
  );
}
