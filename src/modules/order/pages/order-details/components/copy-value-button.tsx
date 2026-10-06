"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

const COPIED_FEEDBACK_MS = 1500;

interface CopyValueButtonProps {
  value: string;
  /** Tên thứ được chép, cho trình đọc màn hình: "số tài khoản" */
  label: string;
}

/** Nút chép một giá trị chuyển khoản; chép xong đổi thành dấu check 1,5 giây */
export function CopyValueButton({ value, label }: CopyValueButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;

    const resetTimer = setTimeout(() => setIsCopied(false), COPIED_FEEDBACK_MS);

    return () => clearTimeout(resetTimer);
  }, [isCopied]);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Sao chép ${label}`}
      onClick={handleCopy}
      className="min-w-[6.5rem] shrink-0"
    >
      {isCopied && (
        <Check aria-hidden className="size-4 shrink-0 text-emerald-600" />
      )}
      {!isCopied && <Copy aria-hidden className="size-4 shrink-0" />}
      <span aria-live="polite">{isCopied ? "Đã chép" : "Sao chép"}</span>
    </Button>
  );
}
