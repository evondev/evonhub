interface OrderWaitingNoteProps {
  message: string;
}

/** Dòng chân card: trang đang tự hỏi lại trạng thái đơn */
export function OrderWaitingNote({ message }: OrderWaitingNoteProps) {
  return (
    <p className="flex items-start gap-2.5 text-pretty text-sm text-muted">
      <span className="relative mt-1.5 flex size-2 shrink-0">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-primary" />
      </span>
      {message}
    </p>
  );
}
