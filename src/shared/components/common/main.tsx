import { useLessonDetailsPath } from "@/shared/hooks";
import { cn } from "@/shared/utils";

export interface MainProps {
  children: React.ReactNode;
}

export function Main({ children }: MainProps) {
  const { isLessonPage } = useLessonDetailsPath();

  return (
    <main
      className={cn(
        "relative grid min-h-[calc(100vh-64px)] grid-cols-1 items-start",
        !isLessonPage && "lg:pl-64",
      )}
    >
      {children}
    </main>
  );
}
