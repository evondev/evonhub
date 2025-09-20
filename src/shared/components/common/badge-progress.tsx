import { cn } from "@/shared/utils";

export interface BadgeProgressProps {
  progress: number;
}

export function BadgeProgress({ progress = 0 }: BadgeProgressProps) {
  let progressItem = {
    label: "Not Started",
    classNames: "text-gray-500 border-gray-500",
  };
  switch (progress) {
    case 0:
      progressItem = {
        label: "Not Started",
        classNames: "text-gray-500 bg-gray-500",
      };
      break;
    case 100:
      progressItem = {
        label: "Completed",
        classNames: "text-green-500 bg-green-500",
      };
      break;
    default:
      progressItem = {
        label: "In Progress",
        classNames: "text-orange-500 bg-orange-500",
      };
      break;
  }

  return (
    <span
      className={cn(
        "inline-block text-xs w-max p-1 px-2 rounded border border-current bg-opacity-10 font-semibold",
        progressItem.classNames
      )}
    >
      {progressItem.label}
    </span>
  );
}
