"use client";
import { reactions } from "@/constants";
import { isAlreadyReaction } from "@/lib/actions/reaction.action";
import { cn } from "@/lib/utils";
import { EReactionType } from "@/types/enums";
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
  const [isReaction, setIsReaction] = useState(false);
  useEffect(() => {
    async function fetchReactions() {
      const res = await isAlreadyReaction({
        lessonId,
        userId,
      });
      setIsReaction(res?.data || false);
    }
    fetchReactions();
  }, [lessonId, userId]);
  if (isReaction) return null;
  return (
    <div className="flex items-center gap-5 justify-end">
      {reactions.map((reaction) => (
        <button
          key={reaction.value}
          className="flex flex-col gap-2 text-xs justify-center items-center group font-semibold hover:-translate-y-3 transition-all"
          onClick={() => handleReaction(reaction.value)}
        >
          <span
            className={cn(
              "size-8 rounded-full flex items-center justify-center text-sm",
              reaction.bg
            )}
          >
            {reaction.icon}
          </span>
          <span className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible">
            {reaction.title}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReactLesson;
