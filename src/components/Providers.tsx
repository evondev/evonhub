"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#2C8FFF"
        options={{ showSpinner: true }}
        shallowRouting
      />
    </>
  );
};

export default Providers;
