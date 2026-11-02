import { describe, expect, it } from "vitest";
import {
  improvementRatingSuggestions,
  positiveRatingSuggestions,
} from "../constants/rating.constants";
import { getRatingSuggestions, toggleRatingSuggestion } from "./rating.utils";

describe("getRatingSuggestions", () => {
  it("4-5 sao gợi ý lời khen", () => {
    expect(getRatingSuggestions(5)).toBe(positiveRatingSuggestions);
    expect(getRatingSuggestions(4)).toBe(positiveRatingSuggestions);
  });

  it("1-3 sao gợi ý điều cần cải thiện", () => {
    expect(getRatingSuggestions(3)).toBe(improvementRatingSuggestions);
    expect(getRatingSuggestions(1)).toBe(improvementRatingSuggestions);
  });
});

describe("toggleRatingSuggestion", () => {
  it("ô trống thì điền thẳng tag", () => {
    expect(toggleRatingSuggestion("", "Dễ hiểu")).toBe("Dễ hiểu");
    expect(toggleRatingSuggestion("   ", "Dễ hiểu")).toBe("Dễ hiểu");
  });

  it("nối thành câu mới bằng dấu chấm", () => {
    expect(toggleRatingSuggestion("Hay", "Dễ hiểu")).toBe("Hay. Dễ hiểu");
  });

  it("đã có dấu câu cuối thì không thêm dấu chấm", () => {
    expect(toggleRatingSuggestion("Hay quá!", "Dễ hiểu")).toBe(
      "Hay quá! Dễ hiểu",
    );
  });

  it("bấm lại thì gỡ tag ở cuối", () => {
    expect(toggleRatingSuggestion("Hay. Dễ hiểu", "Dễ hiểu")).toBe("Hay.");
  });

  it("gỡ tag ở đầu và ở giữa không để lại dấu chấm thừa", () => {
    expect(toggleRatingSuggestion("Dễ hiểu. Hay", "Dễ hiểu")).toBe("Hay");
    expect(toggleRatingSuggestion("A. Dễ hiểu. B", "Dễ hiểu")).toBe("A. B");
  });

  it("gỡ tag duy nhất thì về rỗng", () => {
    expect(toggleRatingSuggestion("Dễ hiểu", "Dễ hiểu")).toBe("");
  });
});
