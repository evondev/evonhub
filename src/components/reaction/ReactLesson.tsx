"use client";
import { reactions } from "@/constants";
import {
  getReactionCount,
  isAlreadyReaction,
} from "@/lib/actions/reaction.action";
import { cn } from "@/lib/utils";
import { EReactionType } from "@/types/enums";
import Image from "next/image";
import { useEffect, useState } from "react";

const ReactLesson = ({
  handleReaction,
  lessonId,
  userId,
}: {
  handleReaction: (reaction: EReactionType) => void;
  lessonId: string;
  userId: string;
}) => {
  const [isReaction, setIsReaction] = useState<string>("");
  const [reactionCount, setReactionCount] =
    useState<Record<EReactionType, number>>();
  useEffect(() => {
    async function fetchReactions() {
      const res = await isAlreadyReaction({
        lessonId,
        userId,
      });
      if (res?.data) {
        setIsReaction(res?.data);
      }
    }
    async function fetchReactionCount() {
      const res = await getReactionCount({
        lessonId,
      });

      if (res) {
        setReactionCount(res);
      }
    }
    fetchReactions();
    fetchReactionCount();
  }, [lessonId, userId]);
  return (
    <div className="flex items-center gap-5 justify-end">
      {reactions.map((reaction) => (
        <button
          key={reaction.value}
          className={cn(
            "flex flex-col gap-2 text-xs justify-center items-center group font-semibold hover:-translate-y-3 transition-all"
          )}
          onClick={() => (isReaction ? null : handleReaction(reaction.value))}
        >
          <span className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
            {reactionCount?.[reaction.value] || 0}
          </span>
          <span
            className={cn(
              "size-10 p-2 rounded-full flex items-center justify-center text-sm",
              isReaction === reaction.value
                ? "bg-[#FEE272]"
                : "bg-white dark:bg-grayDarker"
            )}
          >
            <Image src={reaction.icon} alt="" width={40} height={40} />
          </span>
          <span className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
            {reaction.value}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReactLesson;
