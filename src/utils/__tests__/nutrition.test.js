import { describe, it, expect } from "vitest";
import { calculateConsumed, calculateRemaining } from "../nutrition";

describe("calculateConsumed", () => {
  it("sums calories and macros across meals", () => {
    const meals = [
      { cal: 300, protein: 20, carbs: 30, fat: 10 },
      { cal: 500, protein: 40, carbs: 50, fat: 15 },
    ];
    expect(calculateConsumed(meals)).toEqual({ cal: 800, protein: 60, carbs: 80, fat: 25 });
  });

  it("returns all zeros for an empty meal list", () => {
    expect(calculateConsumed([])).toEqual({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  });

  it("treats missing macro fields as zero instead of throwing", () => {
    const meals = [{ cal: 200 }];
    expect(calculateConsumed(meals)).toEqual({ cal: 200, protein: 0, carbs: 0, fat: 0 });
  });
});

describe("calculateRemaining", () => {
  it("subtracts consumed calories from the target", () => {
    expect(calculateRemaining(1500, 2500)).toBe(1000);
  });

  it("never returns a negative number when over target", () => {
    expect(calculateRemaining(3000, 2500)).toBe(0);
  });
});
