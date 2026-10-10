import { describe, expect, it } from "vitest";
import { cartTotal } from "../src/cart";

describe("cartTotal", () => {
  it("should add up unit price times quantity when prices are whole cents", () => {
    expect(cartTotal([{ name: "pen", unitPrice: 2.5, quantity: 2 }, { name: "pad", unitPrice: 1, quantity: 1 }])).toBe(6);
  });

  it("should multiply by quantity when one item is bought several times", () => {
    expect(cartTotal([{ name: "mug", unitPrice: 4.25, quantity: 4 }])).toBe(17);
  });

  // This test FAILS until the rounding bug in src/cart.ts is fixed.
  it("should round to the nearest cent when floating point drifts", () => {
    expect(cartTotal([{ name: "sticker", unitPrice: 1.13, quantity: 3 }])).toBe(3.39);
  });
});
