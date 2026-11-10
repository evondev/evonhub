import { buildHeroTitleWords } from "../utils";
import { HeroTitleWordList } from "./hero-title-word-list";

/**
 * Tiêu đề hero: vế đầu hiện lên từng chữ, vế sau là một dải màu nhấn chuyển
 * động hiện lên ngay sau
 */
export function HeroTitle() {
  const { leadWords, accentText, accentDelayMs } = buildHeroTitleWords();

  return (
    <h1 className="text-balance font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tighter text-foreground sm:text-6xl lg:text-7xl">
      <HeroTitleWordList words={leadWords} />
      <br className="hidden sm:block" />
      {/* Hai lớp: lớp ngoài chạy hiệu ứng hiện lên, lớp trong chạy dải màu, để
          hai animation không đè nhau */}
      <span
        className="inline-block pb-1 motion-safe:animate-blur-in"
        style={{ animationDelay: `${accentDelayMs}ms` }}
      >
        <span className="text-gradient-brand">{accentText}</span>
      </span>
    </h1>
  );
}
