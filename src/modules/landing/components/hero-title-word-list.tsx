import { Fragment } from "react";
import { HERO_WORD_DELAY_MS } from "../constants";
import { HeroTitleWord } from "../types";

interface HeroTitleWordListProps {
  words: HeroTitleWord[];
}

/** Từng chữ của vế đầu tiêu đề, chữ sau hiện lên trễ hơn chữ trước một nhịp */
export function HeroTitleWordList({ words }: HeroTitleWordListProps) {
  return words.map((word, index) => (
    <Fragment key={`${word.text}-${index}`}>
      <span
        className="inline-block motion-safe:animate-blur-in"
        style={{ animationDelay: `${index * HERO_WORD_DELAY_MS}ms` }}
      >
        {word.text}
      </span>{" "}
    </Fragment>
  ));
}
