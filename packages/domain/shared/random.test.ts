import { describe, expect, it } from "vitest";
import { createRng, nextFloat, nextInt, nextJitter, type RngState } from "./random";

function drawFloats(seed: number, count: number): number[] {
  let rng: RngState = createRng(seed);
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const drawn = nextFloat(rng);
    values.push(drawn.value);
    rng = drawn.rng;
  }
  return values;
}

describe("シード付き乱数", () => {
  it("同じシードなら同じ並びになる", () => {
    expect(drawFloats(42, 100)).toEqual(drawFloats(42, 100));
  });

  it("違うシードなら違う並びになる", () => {
    expect(drawFloats(42, 10)).not.toEqual(drawFloats(43, 10));
  });

  it("シード42の最初の値が変わらない（方式を変えたら気づけるように）", () => {
    expect(drawFloats(42, 3)).toMatchSnapshot();
  });

  it("状態は JSON にしても同じ続きを引ける", () => {
    const first = nextFloat(createRng(7));
    // 保存データを読み戻した場面をまねる。中身は数1つなので、型をそのまま戻してよい。
    const restored = JSON.parse(JSON.stringify(first.rng)) as RngState;
    expect(nextFloat(restored)).toEqual(nextFloat(first.rng));
  });

  it("0 以上 1 未満で、かたよりが大きくない", () => {
    const values = drawFloats(1, 10_000);
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...values)).toBeLessThan(1);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    expect(mean).toBeGreaterThan(0.48);
    expect(mean).toBeLessThan(0.52);
  });

  it("nextInt は両端を含む範囲から引く", () => {
    let rng = createRng(3);
    const seen = new Set<number>();
    for (let i = 0; i < 1_000; i++) {
      const drawn = nextInt(rng, 1, 6);
      seen.add(drawn.value);
      rng = drawn.rng;
    }
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 5, 6]);
    expect(() => nextInt(rng, 5, 1)).toThrow(RangeError);
  });

  it("nextJitter は 1 ± spread に収まる", () => {
    let rng = createRng(9);
    for (let i = 0; i < 1_000; i++) {
      const drawn = nextJitter(rng, 0.05);
      expect(drawn.value).toBeGreaterThanOrEqual(0.95);
      expect(drawn.value).toBeLessThan(1.05);
      rng = drawn.rng;
    }
    expect(() => nextJitter(rng, 1)).toThrow(RangeError);
  });
});
