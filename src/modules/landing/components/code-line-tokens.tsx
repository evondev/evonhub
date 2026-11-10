import { getCodeTokenClassName, tokenizeCodeLine } from "../utils";

interface CodeLineTokensProps {
  code: string;
}

/** Một dòng code đã tô màu cú pháp */
export function CodeLineTokens({ code }: CodeLineTokensProps) {
  return tokenizeCodeLine(code).map((codeToken, index) => (
    <span
      key={`${codeToken.text}-${index}`}
      className={getCodeTokenClassName(codeToken.kind)}
    >
      {codeToken.text}
    </span>
  ));
}
