import { GitBranch, GraduationCap } from "lucide-react";

// Thanh trên của trang lộ trình, nằm trong dải màu brand (chữ trắng). Chữ trắng trên tím #6c5fe6 đạt 4.8:1,
// nên giữ trắng đặc, không làm mờ.
export default function LabTopBar() {
  return (
    <header>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2.5 px-4 sm:px-6">
        <span className="flex size-7 items-center justify-center rounded-lg bg-surface text-primary">
          <GraduationCap className="size-4" aria-hidden />
        </span>
        <span className="text-sm font-semibold">Evonhub · Học backend</span>
        <span className="ml-auto hidden items-center gap-1.5 text-xs sm:flex">
          <GitBranch className="size-3.5" aria-hidden />
          learn/nest-api · 127.0.0.1
        </span>
      </div>
    </header>
  );
}
