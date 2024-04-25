"use server";
import AddCourseForm from "@/components/forms/AddCourseForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  const newUserId = mongoUser?._id.toString();
  return <AddCourseForm userId={newUserId}></AddCourseForm>;
}
