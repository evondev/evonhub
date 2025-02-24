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
        "grid grid-cols-1 pt-8 xl:pt-0 ml-auto lg:min-h-[calc(100vh-144px)] relative items-start",
        {
          "xl:w-[calc(100%-300px)]": !isLessonPage,
        }
      )}
    >
      {children}
    </main>
  );
}
