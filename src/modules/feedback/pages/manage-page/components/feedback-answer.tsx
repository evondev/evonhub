interface FeedbackAnswerProps {
  label: string;
  content: string;
}

/** Một câu trả lời: nhãn nhỏ phía trên, nội dung giữ xuống dòng như người gửi gõ */
export function FeedbackAnswer({ label, content }: FeedbackAnswerProps) {
  return (
    <div>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-0.5 whitespace-pre-line break-words text-sm text-pretty text-foreground">
        {content}
      </p>
    </div>
  );
}
