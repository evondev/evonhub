"use server";
import PageNotFound from "@/app/not-found";
import { commonPath } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import AddMicroForm from "@/modules/micro/components/forms/add-micro-form";
import { UserRole } from "@/shared/constants/user.constants";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect(commonPath.LOGIN);

  const mongoUser = await getUserById({ userId });

  if (![UserRole.Admin].includes(mongoUser?.role)) return <PageNotFound />;

  return <AddMicroForm></AddMicroForm>;
}
