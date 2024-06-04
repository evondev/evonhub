"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#FF695A"
        options={{ showSpinner: true }}
        shallowRouting
      />
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-2 text-sm font-medium bg-red-100 text-red-500 text-center hidden lg:block">
        Nếu tài khoản của bạn không đăng nhập được, vui lòng đăng ký lại nhé.
        Khóa học trả phí của bạn sẽ tự động được thêm lại. Liên hệ mình tại:{" "}
        <a
          href="https://fb.com/tuan.trananh.0509"
          className="font-bold underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook của mình
        </a>
      </div>
    </>
  );
};

export default Providers;
