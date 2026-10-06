"use client";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function PersonalPageError() {
  const router = useRouter();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-10 text-center"
    >
      <div>
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Không tải được hồ sơ
        </p>
        <p className="mt-1 text-sm text-muted">
          Mất kết nối mạng. Kiểm tra mạng rồi thử lại.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={() => router.refresh()}>
        <RotateCw aria-hidden className="size-4" />
        Thử lại
      </Button>
    </div>
  );
}
