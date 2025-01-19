export interface CourseListItemProps {
  title: string;
}

export default function CourseListItem({ title }: CourseListItemProps) {
  return (
    <li className="flex items-baseline lg:items-center gap-2 dark:text-text5 mb-2">
      <div className="size-1.5 rounded-full bg-grayDark dark:bg-white/50 shrink-0"></div>
      <p>{title}</p>
    </li>
  );
}
