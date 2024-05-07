import Profile from "@/components/user/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId });
  if (!mongoUser) return null;
  return <Profile user={JSON.parse(JSON.stringify(mongoUser))}></Profile>;
};

export default page;
