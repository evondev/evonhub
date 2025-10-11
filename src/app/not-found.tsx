"use client";
import FuzzyText from "@/components/FuzzyText";
import { IconHome } from "@/shared/components";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const handleRedirect = () => {
    const history = globalThis.history;

    if (history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const color = theme === "dark" ? "white" : "black";

  return (
    <div className="py-5 lg:py-20 flex flex-col items-center justify-center gap-5">
      <div className="h-[86px]">
        <FuzzyText color={color} baseIntensity={0.2} hoverIntensity={1}>
          404
        </FuzzyText>
      </div>
      <p className="text-center text-base lg:text-lg max-w-[600px] mx-auto mb-5">
        Look like you&apos;re lost. The page you are looking for is not
        available!
      </p>
      <button
        onClick={handleRedirect}
        className="mx-auto flex items-center justify-center gap-3 h-12 px-5 rounded-xl borderDarkModeHover bgDarkMode font-bold min-w-[200px] "
      >
        <IconHome />
        <span>Go back</span>
      </button>
    </div>
  );
};

export default PageNotFound;
