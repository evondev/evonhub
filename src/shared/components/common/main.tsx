import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";

export interface MainProps {
  children: React.ReactNode;
}

export function Main({ children }: MainProps) {
  const { isLessonPage } = useLessonDetailsPath();
  const { isSidebarCollapsed = false } = useGlobalStore();

  return (
    <main
      className={cn(
        "relative grid min-h-[calc(100vh-64px)] grid-cols-1 items-start transition-[padding] duration-200 ease-out motion-reduce:transition-none",
        !isLessonPage && isSidebarCollapsed && "lg:pl-16",
        !isLessonPage && !isSidebarCollapsed && "lg:pl-64",
      )}
    >
      {children}
    </main>
  );
}
