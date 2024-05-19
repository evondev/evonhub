"use client";

import { getUserById } from "@/lib/actions/user.action";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
async function fetchUserData(userId: string) {
  const res = await getUserById({ userId });
  return res;
}
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
