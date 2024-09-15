import PageNotFound from "@/app/not-found";
import { commonPath } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) redirect(commonPath.LOGIN);
  const mongoUser = await getUserById({ userId: userId || "" });
  if (![Role.ADMIN, Role.EXPERT].includes(mongoUser?.role))
    return <PageNotFound></PageNotFound>;
  return <>{children}</>;
};

export default AdminLayout;
