import { highlight } from "sugar-high";

// Tô từng dòng riêng để còn đánh số, đánh dấu và bấm chọn được theo dòng.
export function highlightCodeLines(source: string) {
  return source.replace(/\n$/, "").split("\n").map((line) => highlight(line));
}
