import type { Members } from "pusher-js";
import { ChatSender, PusherPresenceMember } from "../types";

/** Danh sách người online từ presence channel, xếp theo tên */
export function toOnlineMembers(members: Members): ChatSender[] {
  const onlineMembers: ChatSender[] = [];

  members.each((member: PusherPresenceMember) => {
    onlineMembers.push({ userId: member.id, ...member.info });
  });

  return onlineMembers.sort((firstMember, secondMember) =>
    firstMember.name.localeCompare(secondMember.name, "vi"),
  );
}
