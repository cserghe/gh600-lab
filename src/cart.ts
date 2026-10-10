// Tiny shopping-cart module used by every lab.
// It contains ONE deliberate bug (see cartTotal) so the agents have something to fix.

export interface CartItem {
  name: string;
  unitPrice: number; // price of one unit, in euros (e.g. 19.99)
  quantity: number;
}

/** Total price of all items, in euros, rounded to the nearest cent. */
export function cartTotal(items: CartItem[]): number {
  const raw = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  // BUG (on purpose): Math.floor truncates instead of rounding to the nearest cent.
  // 1.13 * 3 = 3.3899999999999997 in floating point, so floor gives 3.38 instead of 3.39.
  // The fix is Math.round. Do NOT "fix" the test instead.
  return Math.floor(raw * 100) / 100;
}
