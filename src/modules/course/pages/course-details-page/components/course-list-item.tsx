import { IconCircleCheck } from "@/shared/components";

export interface CourseListItemProps {
  title: string;
}

export default function CourseListItem({ title }: CourseListItemProps) {
  return (
    <li className="flex items-baseline lg:items-center gap-2 dark:text-text5 mb-2">
      <IconCircleCheck className="text-secondary size-5 shrink-0" />
      <p>{title}</p>
    </li>
  );
}
