"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/shared/utils";
import { MessageSquareHeart } from "lucide-react";
import { useFeedbackPrompt } from "../hooks/use-feedback-prompt";
import { FeedbackForm } from "./feedback-form";

interface FeedbackPromptProps {
  className?: string;
}

/**
 * Nút "Góp ý" trên header kèm hộp khảo sát khoá học, tính năng mong muốn.
 * Chưa góp ý thì hộp tự bật khi vào web, gửi rồi chỉ mở lại bằng nút.
 */
export function FeedbackPrompt({ className }: FeedbackPromptProps) {
  const { isOpen, setIsOpen, handleSubmitted } = useFeedbackPrompt();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Nền tím nhạt, chữ tím: nổi hơn các nút xám trên header nhưng không
            át nút chính của trang */}
        <Button
          size="sm"
          title="Góp ý khoá học, tính năng bạn mong muốn"
          className={cn(
            "shrink-0 border border-primary/20 bg-primary/10 font-semibold text-primary hover:bg-primary/15 max-sm:w-9 max-sm:px-0",
            className,
          )}
        >
          <MessageSquareHeart className="size-4 shrink-0" />
          <span className="max-sm:sr-only">Góp ý</span>
        </Button>
      </DialogTrigger>
      {/* Neo đỉnh, không căn giữa dọc. Có ô nhập nên bấm ra ngoài không đóng */}
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="top-16 w-[calc(100%-2rem)] translate-y-0 gap-0 rounded-2xl border-border bg-surface p-6 sm:top-[8vh] sm:rounded-2xl dark:border-border dark:bg-surface"
      >
        <DialogHeader className="pr-10 text-left">
          <DialogTitle className="text-lg font-semibold text-foreground">
            Bạn mong EvonHub có gì tiếp theo?
          </DialogTitle>
          <DialogDescription className="mt-2 text-pretty text-sm/6 text-muted">
            Chưa tới một phút thôi. Mình đọc hết từng góp ý để chọn khoá học và
            tính năng làm tiếp.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm
          onSubmitted={handleSubmitted}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
