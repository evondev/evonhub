import { reactions } from "@/constants";
import { getAllReactions } from "@/lib/actions/reaction.action";
import { cn } from "@/lib/utils";
import Image from "next/image";

const page = async () => {
  const reactionsData = await getAllReactions();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-bold text-xl">Reactions</h2>
      <div className="items-center gap-5 grid grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {reactions.map((reaction) => (
          <div
            key={reaction.value}
            className={cn(
              "flex flex-col gap-2 text-xs justify-center items-center group font-semibold hover:-translate-y-3 transition-all p-5 rounded-lg dark:bg-grayDarker bg-white"
            )}
          >
            <span
              className={cn(
                "size-10 p-2 rounded-full flex items-center justify-center text-sm bg-[#FEE272]"
              )}
            >
              <Image src={reaction.icon} alt="" width={40} height={40} />
            </span>
            <span className="">{reactionsData[reaction.value] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
