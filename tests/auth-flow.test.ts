import { describe, expect, it } from "vitest";
import {
  firstName,
  isValidFrontendOtp,
  isValidInternationalMobile,
  isValidPhoneInput,
  normaliseZambianPhone,
} from "../lib/auth-flow";

describe("Newworld Cargo frontend authentication", () => {
  it("requires an explicit plus and exactly twelve digits for registration", () => {
    expect(isValidInternationalMobile("+260971234567")).toBe(true);
    for (const phone of [
      "260971234567",
      "0971234567",
      "+26097123456",
      "+2609712345678",
      "+260 971234567",
      "+000971234567",
      "+26097123456a",
    ]) {
      expect(isValidInternationalMobile(phone)).toBe(false);
    }
  });
  it("normalises standard Zambian mobile number formats", () => {
    expect(normaliseZambianPhone("0971 234 567")).toBe("+260971234567");
    expect(normaliseZambianPhone("260971234567")).toBe("+260971234567");
  });

  it("accepts an eleven-digit local mobile entry after normalisation", () => {
    expect(isValidPhoneInput("0971 234 567")).toBe(true);
    expect(isValidPhoneInput("97123")).toBe(false);
  });

  it("accepts real six-digit verification codes from the backend", () => {
    expect(isValidFrontendOtp("123456")).toBe(true);
    expect(isValidFrontendOtp("123455")).toBe(true);
    expect(isValidFrontendOtp("12345")).toBe(false);
    expect(isValidFrontendOtp("ABC123")).toBe(false);
  });

  it("uses a safe first name for the authenticated Home greeting", () => {
    expect(firstName("Chanda Mwila")).toBe("Chanda");
    expect(firstName(" ")).toBe("there");
  });
});
