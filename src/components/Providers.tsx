"use client";

import { getUserById } from "@/lib/actions/user.action";
import { useGlobalStore } from "@/store";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect } from "react";
async function fetchUserData(userId: string) {
  const res = await getUserById({ userId });
  return res;
}
const Providers = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: any;
}) => {
  const { setCurrentUser, setPermissions } = useGlobalStore();
  useEffect(() => {
    if (!initialUser) return;
    setCurrentUser?.(initialUser || null);
    setPermissions?.(initialUser?.permissions || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser?.username]);
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
