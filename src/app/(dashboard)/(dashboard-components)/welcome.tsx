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
    <section>
      <Heading className="text-lg lg:text-2xl">
        {userInfo?.name && (
          <>
            👋 Welcome back,{" "}
            <strong className="text-primary">{userInfo?.name}</strong>
          </>
        )}
        {!userInfo?.name && <>👋 Welcome to EvonHub</>}
      </Heading>
    </section>
  );
}
