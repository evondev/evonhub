import type { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

// Khung giữa màn cho đăng nhập, đăng ký. `.wrapper` ở layout gốc chừa pt-16 và
// pb-16 (lg:pb-0) cho header dashboard; kéo margin âm bù lại để khung phủ đúng một
// màn. Dùng dvh vì 100vh trên Safari iOS tính cả phần thanh công cụ đang ẩn, form
// sẽ lệch xuống. Form cao hơn màn thì khung giãn ra và cuộn bình thường.
export default function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="-mb-16 -mt-16 flex min-h-dvh items-center justify-center px-4 py-8 sm:py-12 lg:mb-0">
      {children}
    </main>
  );
}
