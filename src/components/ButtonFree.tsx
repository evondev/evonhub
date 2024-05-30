"use server";
import { primaryButtonClassName } from "@/constants";
import { updateCourseViews } from "@/lib/actions/course.action";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const ButtonFree = async ({ slug }: { slug: string }) => {
  const handleEnrollFree = async (slug: string) => {
    try {
      await updateCourseViews(slug);
    } catch (error) {
      console.log("error:", error);
    }
  };
  return (
    <Button
      type="button"
      // onClick={() => handleEnrollFree(slug)}
      className={cn(primaryButtonClassName, "w-full bg-secondary")}
    >
      Lụm liền
    </Button>
  );
};

export default ButtonFree;
