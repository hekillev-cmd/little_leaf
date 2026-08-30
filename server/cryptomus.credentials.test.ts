import { describe, expect, it } from "vitest";
import { checkCryptomusCredentials, isCryptomusConfigured } from "./cryptomus";

describe("Cryptomus credentials", () => {
  it.skipIf(process.env.CRYPTOMUS_LIVE_TEST !== "1")("authenticates with the payment API key stored in project secrets", async () => {
    expect(isCryptomusConfigured()).toBe(true);
    expect(await checkCryptomusCredentials()).toBe(true);
  }, 20_000);
});
