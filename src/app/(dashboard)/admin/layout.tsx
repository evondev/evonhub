import { NotFoundState } from "@/shared/components/not-found";
import { commonPath } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import { AdminNav } from "@/shared/components/common/admin-nav";
import { UserRole } from "@/shared/constants/user.constants";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) redirect(commonPath.LOGIN);

  const user = await getUserById({ userId });

  if (![UserRole.Admin, UserRole.Expert].includes(user?.role))
    return <NotFoundState />;

  return (
    <>
      <AdminNav role={user.role} />
      {children}
    </>
  );
};

export default AdminLayout;
