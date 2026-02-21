import PageNotFound from "@/app/not-found";
import { commonPath } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import { UserRole } from "@/shared/constants/user.constants";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) redirect(commonPath.LOGIN);

  const user = await getUserById({ userId });

  if (![UserRole.Admin, UserRole.Expert].includes(user?.role))
    return <PageNotFound></PageNotFound>;

  return <>{children}</>;
};

export default AdminLayout;
