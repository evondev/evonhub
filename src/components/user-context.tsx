"use client";
import { useQueryUserById } from "@/modules/user/services";
import { UserInfoData } from "@/shared/types/user.types";
import { useGlobalStore } from "@/store";
import { useAuth } from "@clerk/nextjs";
import { createContext, useContext, useEffect } from "react";

const UserContext = createContext<{
  userInfo?: UserInfoData | null;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const { setUserRole } = useGlobalStore();
  const { data: userInfo } = useQueryUserById({ userId: userId || "" });
  console.log("UserProvider ~ userInfo:", userInfo);
  useEffect(() => {
    if (!userInfo) return;
    setUserRole?.(userInfo?.role || "");
  }, [setUserRole, userInfo]);
  return (
    <UserContext.Provider value={{ userInfo }}>{children}</UserContext.Provider>
  );
};
export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }

  return context;
};
