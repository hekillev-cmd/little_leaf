import { describe, expect, it } from "vitest";
import { CATEGORIES, PRODUCTS, getCartCount, getCartTotal, getProductsForCategory } from "../client/src/lib/catalog";

describe("store catalog", () => {
  it("returns all products for the all category and filters a named category", () => {
    expect(getProductsForCategory(undefined)).toHaveLength(PRODUCTS.length);
    expect(getProductsForCategory("كتب-التلوين")).toHaveLength(2);
    expect(CATEGORIES.some((category) => category.slug === "دفاتر-الرسم")).toBe(true);
  });

  it("calculates cart quantity and total from product ids", () => {
    const cart = { "little-garden": 2, "draw-with-nour": 1 };
    expect(getCartCount(cart)).toBe(3);
    expect(getCartTotal(cart)).toBeCloseTo(24.9, 5);
  });

  it("treats unknown cart ids as zero value", () => {
    expect(getCartCount({ missing: 4 })).toBe(4);
    expect(getCartTotal({ missing: 4 })).toBe(0);
  });
});
