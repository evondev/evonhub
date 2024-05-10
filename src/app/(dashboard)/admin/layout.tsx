import PageNotFound from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  const user = JSON.parse(JSON.stringify(mongoUser));

  if (user?.role !== Role.ADMIN) return <PageNotFound></PageNotFound>;
  return <div>{children}</div>;
};

export default AdminLayout;
