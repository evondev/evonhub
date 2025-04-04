export interface TableActionsProps {
  children: React.ReactNode;
}

export function TableActions({ children }: TableActionsProps) {
  return <div className="flex gap-3">{children}</div>;
}
