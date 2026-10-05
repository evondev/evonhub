"use client";

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function LearnerLoadError() {
  const router = useRouter();

  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-10 text-center"
    >
      <p className="text-sm font-medium text-red-600 dark:text-red-400">
        Không tải được tiến độ học của bạn
      </p>
      <Button variant="outline" onClick={() => router.refresh()}>
        <RotateCw className="size-4 shrink-0" />
        Thử lại
      </Button>
    </section>
  );
}
