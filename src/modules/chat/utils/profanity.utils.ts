import {
  bannedTerms,
  bannedTermsWithDiacritics,
  CHAT_LINK_PATTERN,
} from "../constants";

/** Số/ký hiệu hay dùng thay chữ để lách lọc: "d1t", "f@ck" */
const LEET_CHARACTERS: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "@": "a",
  $: "s",
};

const LEET_PATTERN = /[0134@$]/g;
const NON_WORD_PATTERN = /[^\p{L}\p{N}]+/u;
const COMBINING_MARK_PATTERN = /[̀-ͯ]/g;

interface CharacterRun {
  character: string;
  count: number;
}

function replaceLeetCharacters(text: string): string {
  return text.replace(LEET_PATTERN, (character) => LEET_CHARACTERS[character]);
}

function stripDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_MARK_PATTERN, "")
    .replace(/đ/g, "d");
}

/** Chữ thường, dựng dấu về một dạng (NFC) để bàn phím macOS (NFD) so được */
function prepareWithDiacritics(text: string): string {
  return replaceLeetCharacters(text.toLowerCase().normalize("NFC"));
}

function prepareWithoutDiacritics(text: string): string {
  return stripDiacritics(prepareWithDiacritics(text));
}

function tokenize(text: string): string[] {
  return text.split(NON_WORD_PATTERN).filter(Boolean);
}

/** "d.m" hay "v c l" tách thành từng chữ cái: ghép lại thành "dm", "vcl" */
function mergeSingleCharacterTokens(tokens: string[]): string[] {
  const mergedTokens: string[] = [];
  let singleCharacterRun = "";

  for (const token of tokens) {
    if (Array.from(token).length === 1) {
      singleCharacterRun += token;
      continue;
    }

    if (singleCharacterRun) mergedTokens.push(singleCharacterRun);

    singleCharacterRun = "";
    mergedTokens.push(token);
  }

  if (singleCharacterRun) mergedTokens.push(singleCharacterRun);

  return mergedTokens;
}

function toCharacterRuns(word: string): CharacterRun[] {
  const runs: CharacterRun[] = [];

  for (const character of Array.from(word)) {
    const lastRun = runs[runs.length - 1];

    if (lastRun?.character === character) {
      lastRun.count += 1;
      continue;
    }

    runs.push({ character, count: 1 });
  }

  return runs;
}

/**
 * Token là từ cấm bị kéo dài ra ("dmmm" so với "dm", "fuckkk" so với "fuck").
 * So theo từng cụm ký tự lặp nên "cm" không bị nhầm thành "cmm".
 */
function isStretchedForm(token: string, bannedWord: string): boolean {
  const tokenRuns = toCharacterRuns(token);
  const bannedRuns = toCharacterRuns(bannedWord);

  if (tokenRuns.length !== bannedRuns.length) return false;

  return bannedRuns.every(
    (bannedRun, index) =>
      tokenRuns[index].character === bannedRun.character &&
      tokenRuns[index].count >= bannedRun.count,
  );
}

function hasBannedSequence(tokens: string[], bannedWords: string[]): boolean {
  const lastStartIndex = tokens.length - bannedWords.length;

  for (let startIndex = 0; startIndex <= lastStartIndex; startIndex++) {
    const isMatched = bannedWords.every((bannedWord, offset) =>
      isStretchedForm(tokens[startIndex + offset], bannedWord),
    );

    if (isMatched) return true;
  }

  return false;
}

function hasAnyBannedTerm(tokens: string[], bannedTermList: string[][]) {
  const tokenVariants = [tokens, mergeSingleCharacterTokens(tokens)];

  return tokenVariants.some((tokenVariant) =>
    bannedTermList.some((bannedWords) =>
      hasBannedSequence(tokenVariant, bannedWords),
    ),
  );
}

// Chuẩn hoá danh sách một lần lúc nạp module, không làm lại mỗi tin
const preparedBannedTerms = bannedTerms.map((term) =>
  tokenize(prepareWithoutDiacritics(term)),
);
const preparedBannedTermsWithDiacritics = bannedTermsWithDiacritics.map(
  (term) => tokenize(prepareWithDiacritics(term)),
);

/**
 * Tin có từ bậy không. So theo từ chứ không theo chuỗi con, để "admin" hay
 * "cm" không bị chặn oan; đổi lại từ cấm dính liền chữ khác thì lọt.
 * Bỏ qua link: đường dẫn hay có đoạn viết tắt trùng từ cấm.
 */
export function hasProfanity(content: string): boolean {
  const contentWithoutLinks = content.replace(CHAT_LINK_PATTERN, " ");
  const tokensWithDiacritics = tokenize(
    prepareWithDiacritics(contentWithoutLinks),
  );

  if (
    hasAnyBannedTerm(tokensWithDiacritics, preparedBannedTermsWithDiacritics)
  ) {
    return true;
  }

  const tokensWithoutDiacritics = tokenize(
    prepareWithoutDiacritics(contentWithoutLinks),
  );

  return hasAnyBannedTerm(tokensWithoutDiacritics, preparedBannedTerms);
}
