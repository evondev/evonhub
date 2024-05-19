"use client";
import { useGlobalStore } from "@/store";
import React, { useEffect } from "react";

const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: any;
}) => {
  const { setCurrentUser, setPermissions, setUserRole } = useGlobalStore();
  useEffect(() => {
    if (!initialUser) return;
    setCurrentUser?.(initialUser || null);
    setPermissions?.(initialUser?.permissions || []);
    setUserRole?.(initialUser?.role || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser?.username]);
  return <>{children}</>;
};

export default AuthProvider;
