import { describe, expect, it } from "vitest";
import { PRODUCTS, searchProducts } from "../client/src/lib/catalog";
import { addCartItem, removeCartItem, setCartQuantity } from "../client/src/contexts/StoreContext";
import { createDemoPaymentConfirmation, DEMO_PAYMENT_ADDRESS, getCheckoutRedirectPath, getUsdtAmount } from "../client/src/lib/checkout";

describe("store interactions", () => {
  it("adds, updates, and removes cart items immutably", () => {
    const initial = {};
    const withItem = addCartItem(initial, PRODUCTS[0].id);
    const updated = setCartQuantity(withItem, PRODUCTS[0].id, 3);
    const removed = removeCartItem(updated, PRODUCTS[0].id);
    expect(initial).toEqual({});
    expect(withItem[PRODUCTS[0].id]).toBe(1);
    expect(updated[PRODUCTS[0].id]).toBe(3);
    expect(removed).toEqual({});
  });

  it("removes an item when quantity is zero or lower", () => {
    expect(setCartQuantity({ "little-garden": 1 }, "little-garden", 0)).toEqual({});
    expect(setCartQuantity({ "little-garden": 1 }, "little-garden", -2)).toEqual({});
  });

  it("searches the catalog by Arabic product text", () => {
    expect(searchProducts("تلوين").map((product) => product.id)).toEqual(["little-garden", "space-adventure"]);
    expect(searchProducts("غير موجود")).toEqual([]);
  });

  it("redirects an empty checkout to the cart and keeps a non-empty checkout", () => {
    expect(getCheckoutRedirectPath(0)).toBe("/cart");
    expect(getCheckoutRedirectPath(1)).toBeNull();
  });

  it("creates an explicit simulated payment confirmation", () => {
    expect(getUsdtAmount(7.34)).toBeCloseTo(7.34, 5);
    expect(DEMO_PAYMENT_ADDRESS).toContain("عنوان تجريبي");
    expect(createDemoPaymentConfirmation("TRC20")).toEqual({
      confirmed: true,
      network: "TRC20",
      message: expect.stringContaining("الدفع المحاكي"),
    });
  });
});
