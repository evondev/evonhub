interface InterviewFieldLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  isRequired?: boolean;
  /** Chữ xám nhỏ sau nhãn, ví dụ "không bắt buộc" */
  hint?: string;
}

export function InterviewFieldLabel({
  children,
  htmlFor,
  isRequired = false,
  hint,
}: InterviewFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
      {isRequired && <span className="text-red-600"> *</span>}
      {hint && <span className="font-normal text-muted"> · {hint}</span>}
    </label>
  );
}
