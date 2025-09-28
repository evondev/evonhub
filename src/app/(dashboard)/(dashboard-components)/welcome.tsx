import { getUserById } from "@/lib/actions/user.action";
import { Heading } from "@/shared/components";
import { UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";

export interface WelcomeProps {}

export async function Welcome(_props: WelcomeProps) {
  const { userId } = auth();
  const userInfo = (await getUserById({
    userId: userId || "",
  })) as UserItemData;
  return (
    <section className="p-5 rounded-xl bg-primary text-white">
      <Heading className="lg:text-2xl text-white">
        {userInfo?.name && <>Chào mừng đã quay trở lại, {userInfo?.name} 👋</>}
        {!userInfo?.name && <>Welcome to EvonHub 👋</>}
      </Heading>
    </section>
  );
}
