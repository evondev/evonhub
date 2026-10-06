import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { ChatSender } from "../../../types";
import { ChatRoleBadge } from "./chat-role-badge";

interface ChatOnlineMemberRowProps {
  member: ChatSender;
}

export function ChatOnlineMemberRow({ member }: ChatOnlineMemberRowProps) {
  return (
    <li className="flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-item-hover">
      <span className="relative shrink-0">
        <CommentAvatar
          name={member.name}
          avatar={member.avatar}
          className="size-7"
        />
        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-600 ring-2 ring-surface" />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {member.name}
      </span>
      <ChatRoleBadge role={member.role} />
    </li>
  );
}
