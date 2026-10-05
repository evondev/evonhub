import Image from "next/image";
import { getFirstName } from "../utils";

interface TestimonialAvatarProps {
  name: string;
  avatar?: string;
}

export function TestimonialAvatar({ name, avatar }: TestimonialAvatarProps) {
  if (avatar) {
    return (
      <Image
        width={32}
        height={32}
        alt=""
        src={avatar}
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-medium uppercase text-primary-strong">
      {getFirstName(name).charAt(0)}
    </span>
  );
}
