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
        // Sidebar nổi cách mép 16px: chừa mép trái + bề rộng sidebar
        !isLessonPage && "lg:min-h-[calc(100vh-80px)]",
        !isLessonPage && isSidebarCollapsed && "lg:pl-20",
        !isLessonPage && !isSidebarCollapsed && "lg:pl-[272px]",
      )}
    >
      {children}
    </main>
  );
}
