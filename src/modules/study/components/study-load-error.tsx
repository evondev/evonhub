"use client";

import { Button } from "@/components/ui/button";
import { CloudOff, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function StudyLoadError() {
  const router = useRouter();

  return (
    <section
      role="alert"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-10 text-center"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-foreground/5 text-muted">
        <CloudOff className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Chưa tải được khóa học của bạn
        </h2>
        <p className="mt-1 text-sm text-muted">
          Kết nối có vấn đề. Thử tải lại, nếu vẫn lỗi thì báo cho Evondev.
        </p>
      </div>
      <Button variant="outline" onClick={() => router.refresh()}>
        <RotateCw className="size-4 shrink-0" />
        Tải lại
      </Button>
    </section>
  );
}
