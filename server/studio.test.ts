import { describe, expect, it } from "vitest";
import { toggleGateway, validatePublishDraft } from "../client/src/lib/studio";
import { getPaymentAddress } from "../client/src/lib/checkout";

describe("store studio", () => {
  it("requires title, positive price, category, cover, and download file", () => {
    expect(validatePublishDraft({ title: "", price: "0", category: "", cover: null, download: null }).valid).toBe(false);
    expect(validatePublishDraft({ title: "Color book", price: "7.5", category: "كتب-التلوين", cover: new File(["cover"], "cover.png"), download: new File(["pdf"], "book.pdf") }).valid).toBe(true);
  });

  it("returns the configured wallet address for every supported network", () => {
    expect(getPaymentAddress("TRC20")).toBe("TD8y8sdVXHweLijpTitWnhoResJhvTdFiF");
    expect(getPaymentAddress("SOL")).toBe("2eCoA9BHVaSzdVqRH7jmjsosF7puqtkXeYJ7bpw89syj");
    expect(getPaymentAddress("BEP20")).toBe("0x525aA8d9E33a5193985490D871b154209Bf801f7");
    expect(getPaymentAddress("ERC20")).toBe(getPaymentAddress("ARB"));
  });

  it("toggles additional gateways without duplicating them", () => {
    expect(toggleGateway(["usdt"], "stripe")).toEqual(["usdt", "stripe"]);
    expect(toggleGateway(["usdt", "stripe"], "stripe")).toEqual(["usdt"]);
  });
});
