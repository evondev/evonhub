"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommentAvatar } from "@/shared/features/comment/comment-avatar";
import { CHAT_STACKED_AVATAR_COUNT } from "../../../constants";
import { ChatSender } from "../../../types";
import { groupOnlineMembers } from "../../../utils";
import { ChatOnlineMemberRow } from "./chat-online-member-row";

interface ChatOnlineListProps {
  members: ChatSender[];
}

/** Avatar xếp chồng và số người online; bấm vào xem đủ danh sách, giảng viên đứng đầu */
export function ChatOnlineList({ members }: ChatOnlineListProps) {
  const stackedMembers = members.slice(0, CHAT_STACKED_AVATAR_COUNT);
  const { staffMembers, learnerMembers } = groupOnlineMembers(members);

  if (members.length === 0) {
    return <span className="text-sm text-muted">Đang kết nối…</span>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="-ml-2 h-10 max-w-full gap-2.5 rounded-xl px-2 font-normal hover:bg-foreground/5 data-[state=open]:bg-foreground/5">
          <span className="flex -space-x-2">
            {stackedMembers.map((member) => (
              <CommentAvatar
                key={member.userId}
                name={member.name}
                avatar={member.avatar}
                className="size-7 ring-2 ring-surface"
              />
            ))}
          </span>
          <span className="flex items-center gap-1.5 truncate text-sm text-foreground">
            <span className="size-2 shrink-0 rounded-full bg-green-600" />
            {/* Một span chứa cả câu: chữ nằm thẳng trong flex thì bị giãn theo gap */}
            <span className="truncate">
              {members.length}{" "}
              <span className="hidden sm:inline">đang </span>online
            </span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="max-h-96 w-64 overflow-y-auto rounded-2xl border-border bg-surface p-2 text-foreground shadow-popover dark:border-border dark:bg-surface"
      >
        {staffMembers.length > 0 && (
          <>
            <p className="px-2 pb-1 pt-1 text-xs font-medium text-muted">
              Giảng viên, Admin · {staffMembers.length}
            </p>
            <ul>
              {staffMembers.map((member) => (
                <ChatOnlineMemberRow key={member.userId} member={member} />
              ))}
            </ul>
          </>
        )}
        <p className="px-2 pb-1 pt-4 text-xs font-medium text-muted first:pt-1">
          Học viên · {learnerMembers.length}
        </p>
        <ul>
          {learnerMembers.map((member) => (
            <ChatOnlineMemberRow key={member.userId} member={member} />
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
