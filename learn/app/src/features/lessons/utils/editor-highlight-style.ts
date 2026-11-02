import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Editor dùng cùng bảng màu với khung code chỉ đọc (biến --sh-* của sugar-high trong globals.css).
// Màu mặc định của CodeMirror có chuỗi cam #ee4400, tương phản 3.8:1 trên nền trắng: khó đọc.
const editorHighlightStyle = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.moduleKeyword, tags.definitionKeyword], color: "var(--sh-keyword)" },
  { tag: [tags.string, tags.special(tags.string), tags.regexp], color: "var(--sh-string)" },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: "var(--sh-comment)" },
  { tag: [tags.propertyName, tags.function(tags.variableName), tags.function(tags.propertyName)], color: "var(--sh-property)" },
  { tag: [tags.className, tags.typeName, tags.number, tags.bool], color: "var(--sh-class)" },
  { tag: [tags.operator, tags.punctuation, tags.bracket], color: "var(--sh-sign)" },
  { tag: [tags.variableName, tags.definition(tags.variableName)], color: "var(--sh-identifier)" },
]);

export const editorHighlighting = syntaxHighlighting(editorHighlightStyle);
