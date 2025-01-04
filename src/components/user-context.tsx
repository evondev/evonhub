"use client";
import { useQueryUserById } from "@/modules/user/services";
import { UserItemData } from "@/modules/user/types";
import { useAuth } from "@clerk/nextjs";
import { createContext, useContext } from "react";

const UserContext = createContext<{
  userInfo?: UserItemData | null;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const { data: userInfo } = useQueryUserById({ userId: userId || "" });

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
