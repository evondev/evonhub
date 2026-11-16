"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useFeatureAnnouncement } from "../hooks/use-feature-announcement";
import { buildFeatureAnnouncementItems } from "../utils";
import { FeatureAnnouncementCard } from "./feature-announcement-card";

interface FeatureAnnouncementDialogProps {
  isEnabled: boolean;
}

/** Hộp "Có gì mới" bật một lần cho mỗi người sau khi đăng nhập */
export function FeatureAnnouncementDialog({
  isEnabled,
}: FeatureAnnouncementDialogProps) {
  const { isOpen, setIsOpen, username } = useFeatureAnnouncement({
    isEnabled,
  });
  const announcementItems = buildFeatureAnnouncementItems(username);

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-0 rounded-2xl border-border bg-surface p-6 sm:rounded-2xl dark:border-border dark:bg-surface">
        <DialogHeader className="pr-8 text-left">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-strong">
            <Sparkles className="size-3.5" aria-hidden />
            Mới trên EvonHub
          </span>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {announcementItems.length} tính năng mới đang chờ bạn
          </DialogTitle>
          <DialogDescription className="mt-1 text-pretty text-sm/6 text-muted">
            Mình vừa làm xong, bạn ghé thử nhé.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-5 flex flex-col gap-3">
          {announcementItems.map((item) => (
            <FeatureAnnouncementCard
              key={item.id}
              item={item}
              onNavigate={handleClose}
            />
          ))}
        </div>
        <Button variant="ghost" onClick={handleClose} className="mt-4 w-full">
          Để sau
        </Button>
      </DialogContent>
    </Dialog>
  );
}
