import { describe, expect, it } from "vitest";
import { getProfileSocialLinks } from ".";

describe("getProfileSocialLinks", () => {
  it("chỉ trả mạng xã hội đã điền, theo thứ tự Facebook, LinkedIn, YouTube", () => {
    const socialLinks = getProfileSocialLinks({
      youtube: "https://youtube.com/@evondev",
      facebook: " https://facebook.com/evondev ",
      linkedin: "",
    });

    expect(socialLinks.map((socialLink) => socialLink.name)).toEqual([
      "facebook",
      "youtube",
    ]);
    expect(socialLinks[0].url).toBe("https://facebook.com/evondev");
  });

  it("bỏ link không phải http(s) như javascript:", () => {
    expect(
      getProfileSocialLinks({ facebook: "javascript:alert(1)" }),
    ).toEqual([]);
  });

  it("user chưa có socials thì không có icon nào", () => {
    expect(getProfileSocialLinks(undefined)).toEqual([]);
  });
});
