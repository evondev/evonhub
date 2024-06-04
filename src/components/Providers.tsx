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
    </>
  );
};

export default Providers;
