import { LEADERBOARD_EMPTY_HINT } from "../constants";
import { LeaderboardStanding } from "../types";

interface WeekStandingTextProps {
  standing: LeaderboardStanding;
}

/** Hai dòng của khối "Tuần này": phút và hạng, rồi khoảng cách tới người trên */
export function WeekStandingText({ standing }: WeekStandingTextProps) {
  if (standing.rank === 0) {
    return (
      <>
        <p className="text-base font-semibold text-foreground">
          Tuần này bạn chưa có phút học nào
        </p>
        <p className="mt-0.5 text-sm text-muted">{LEADERBOARD_EMPTY_HINT}</p>
      </>
    );
  }

  return (
    <>
      <p className="text-base font-semibold text-foreground">
        Tuần này: <span className="tabular-nums">{standing.minutes} phút</span>{" "}
        <span className="text-muted">·</span> hạng{" "}
        <span className="tabular-nums">#{standing.rank}</span>
      </p>
      <p className="mt-0.5 truncate text-sm text-muted">
        {standing.above && (
          <>
            Còn{" "}
            <span className="font-medium tabular-nums text-foreground">
              {standing.above.gapMinutes} phút
            </span>{" "}
            để vượt {standing.above.name}
          </>
        )}
        {!standing.above && "Bạn đang dẫn đầu tuần này"}
      </p>
    </>
  );
}
