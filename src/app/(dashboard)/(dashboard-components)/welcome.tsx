import { getUserById } from "@/lib/actions/user.action";
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
      <div>
        <div className="font-bold text-2xl mb-2 dark:text-white">
          <strong className="text-primary text-3xl">AI</strong> viết code giúp
          bạn. Nhưng <strong className="text-primary text-3xl">hậu quả</strong>{" "}
          thì bạn chịu
        </div>
        <p className="text-base font-medium text-gray-600 dark:text-white">
          Học cách đưa sản phẩm của chính mình production — và biết nó sẽ lủng ở
          đâu, trước khi người dùng tìm ra.
        </p>
      </div>
    </section>
  );
}
