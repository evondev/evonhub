"use client";
import { useGlobalStore } from "@/store";
import ButtonGradient from "../button/ButtonGradient";
import { IconLongArrowRight } from "../icons";

const LessonToggle = () => {
  const { isExpanded, toggleExpanded } = useGlobalStore();
  const handleCloseLessons = () => {
    toggleExpanded?.(false);
  };
  return (
    <>
      {isExpanded && (
        <button
          className="hidden md:flex fixed right-0 top-16 items-center justify-center rotate-180"
          onClick={handleCloseLessons}
        >
          <ButtonGradient
            className={{
              wrapper: "size-10 bg-white rounded-lg ",
            }}
          >
            <IconLongArrowRight />
          </ButtonGradient>
        </button>
      )}
    </>
  );
};

export default LessonToggle;
