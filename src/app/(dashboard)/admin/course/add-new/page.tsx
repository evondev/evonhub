"use server";
import PageNotFound from "@/app/not-found";
import AddCourseForm from "@/components/forms/AddCourseForm";
import { commonPath } from "@/constants";
import { getUserById } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect(commonPath.LOGIN);
  const mongoUser = await getUserById({ userId });
  if (![Role.ADMIN, Role.EXPERT].includes(mongoUser?.role))
    return <PageNotFound />;
  const newUserId = mongoUser?._id.toString();
  return <AddCourseForm userId={newUserId}></AddCourseForm>;
}
