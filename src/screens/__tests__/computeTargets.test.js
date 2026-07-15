import { describe, it, expect } from "vitest";
import { computeTargets } from "../LoginScreen.jsx";

describe("computeTargets", () => {
  it("produces higher calorie targets for a muscle-gain goal than a fat-loss goal", () => {
    const base = { age: "28", height: "165", weight: "56", sex: "male", activity: "moderate" };
    const gain = computeTargets({ ...base, goal: "gain" });
    const lose = computeTargets({ ...base, goal: "lose" });
    expect(gain.calories).toBeGreaterThan(lose.calories);
  });

  it("scales protein target with bodyweight", () => {
    const light = computeTargets({ age: "28", height: "165", weight: "56", sex: "male", activity: "moderate", goal: "maintain" });
    const heavier = computeTargets({ age: "28", height: "165", weight: "90", sex: "male", activity: "moderate", goal: "maintain" });
    expect(heavier.protein).toBeGreaterThan(light.protein);
  });

  it("never returns negative or NaN values even with missing input", () => {
    const result = computeTargets({});
    expect(result.calories).toBeGreaterThan(0);
    expect(Number.isNaN(result.calories)).toBe(false);
  });
});
