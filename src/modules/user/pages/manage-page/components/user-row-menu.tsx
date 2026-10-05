"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Lock, LockOpen, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { UserManageRow } from "../../../types/user-manage.types";
import {
  buildUserManageHref,
  isLockedUser,
} from "../../../utils/user-manage.utils";

interface UserRowMenuProps {
  user: UserManageRow;
  onToggleStatus: (user: UserManageRow) => void;
}

const menuItemClassName =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-foreground/80 focus:bg-item-hover focus:text-foreground dark:focus:bg-item-hover dark:focus:text-foreground";

export function UserRowMenu({ user, onToggleStatus }: UserRowMenuProps) {
  const isLocked = isLockedUser(user);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Thao tác với ${user.name}`}
          className="size-9 rounded-lg hover:bg-foreground/[0.08] data-[state=open]:bg-foreground/[0.08] data-[state=open]:text-foreground"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex w-56 flex-col gap-0.5 rounded-xl border-border bg-surface p-1 text-foreground shadow-lg dark:border-border dark:bg-surface dark:text-foreground"
      >
        <DropdownMenuItem asChild className={menuItemClassName}>
          <Link href={buildUserManageHref(user)}>
            <BookOpen className="size-4 text-muted" />
            Quản lý khoá học
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-border dark:bg-border" />
        {isLocked && (
          <DropdownMenuItem
            onSelect={() => onToggleStatus(user)}
            className={menuItemClassName}
          >
            <LockOpen className="size-4 text-muted" />
            Mở khoá tài khoản
          </DropdownMenuItem>
        )}
        {!isLocked && (
          // Khoá là cắt quyền vào học: tô đỏ như việc nguy hiểm
          <DropdownMenuItem
            onSelect={() => onToggleStatus(user)}
            className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-rose-700 focus:bg-rose-500/10 focus:text-rose-700 dark:text-rose-400 dark:focus:text-rose-400"
          >
            <Lock className="size-4" />
            Khoá tài khoản
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
