import AddCourseForm from "@/components/forms/AddCourseForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  return (
    <AddCourseForm
      userId={JSON.parse(JSON.stringify(mongoUser?._id))}
    ></AddCourseForm>
  );
}
