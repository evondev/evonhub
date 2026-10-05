export interface CourseListItemProps {
  title: string;
}

export default function CourseListItem({ title }: CourseListItemProps) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden="true"
        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-foreground/30"
      />
      <span>{title}</span>
    </li>
  );
}
