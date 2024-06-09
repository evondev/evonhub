"use client";

import { cn } from "@/lib/utils";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useParams, useSearchParams } from "next/navigation";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const searchParams = useSearchParams();
  return (
    <div
      className={cn(
        "",
        params.course && searchParams.has("slug") ? "lesson-study-page" : ""
      )}
    >
      {children}
      <ProgressBar
        height="3px"
        color="#FF695A"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
};

export default Providers;
