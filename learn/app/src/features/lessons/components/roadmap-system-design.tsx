import { ExternalLink, Gamepad2, Gauge } from "lucide-react";
import { gonnaCrashUrl } from "../constants/gonna-crash";

interface RoadmapSystemDesignProps {
  gameLevels?: string[];
  loadTest?: string;
}

// Phần system design của một mốc: màn game khởi động và cách phá bằng tải trên Evonhub.
export default function RoadmapSystemDesign({ gameLevels, loadTest }: RoadmapSystemDesignProps) {
  const hasGameLevels = Boolean(gameLevels?.length);

  if (!hasGameLevels && !loadTest) return null;

  return (
    <div className="space-y-3 rounded-xl bg-background px-4 py-3 text-sm">
      {hasGameLevels && (
        <div className="flex items-start gap-3">
          <Gamepad2 className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p>
              <span className="font-medium">Khởi động bằng game:</span>{" "}
              <span className="text-muted">{gameLevels?.join(" · ")}</span>
            </p>
            <a
              href={gonnaCrashUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Mở GonnaCrash
              <ExternalLink className="size-3" aria-hidden />
            </a>
          </div>
        </div>
      )}

      {loadTest && (
        <div className="flex items-start gap-3">
          <Gauge className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
          <p>
            <span className="font-medium">Phá bằng tải:</span> <span className="text-muted">{loadTest}.</span>
          </p>
        </div>
      )}
    </div>
  );
}
