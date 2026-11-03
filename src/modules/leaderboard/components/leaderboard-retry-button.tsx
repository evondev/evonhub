"use client";

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface LeaderboardRetryButtonProps {
  size?: "default" | "sm";
}

/** Bảng đọc ở server: thử lại là dựng lại trang, không gọi action riêng */
export function LeaderboardRetryButton({
  size = "default",
}: LeaderboardRetryButtonProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();

  function handleRetry() {
    startRefresh(() => router.refresh());
  }

  return (
    <Button
      variant="outline"
      size={size}
      isLoading={isRefreshing}
      onClick={handleRetry}
    >
      <RotateCw className="size-4 shrink-0" />
      Thử lại
    </Button>
  );
}
