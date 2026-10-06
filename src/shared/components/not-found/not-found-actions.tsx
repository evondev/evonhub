"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Nút đặc trên, rộng hết dưới sm; từ sm co theo chữ, đứng ngang
export function NotFoundActions() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  // Đọc lịch sử sau khi mount để server và client render giống nhau. Mở thẳng
  // bằng link (tab mới) thì không có trang trước, ẩn nút quay lại
  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  function handleGoBack() {
    router.back();
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Button asChild variant="primary" className="h-11 w-full sm:w-auto md:h-10">
        <Link href="/">Về trang chủ</Link>
      </Button>
      {canGoBack && (
        <Button
          variant="outline"
          className="h-11 w-full sm:w-auto md:h-10"
          onClick={handleGoBack}
        >
          Quay lại trang trước
        </Button>
      )}
    </div>
  );
}
