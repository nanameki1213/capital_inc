import { describe, expect, it } from "vitest";
import { addYen, mulYen, roundYen, subYen, yen } from "./money";

describe("yen", () => {
  it("整数だけを受け付ける", () => {
    expect(yen(1200)).toBe(1200);
    expect(() => yen(1.5)).toThrow(RangeError);
    expect(() => yen(Number.MAX_SAFE_INTEGER + 1)).toThrow(RangeError);
  });
});

describe("roundYen", () => {
  it("四捨五入する", () => {
    expect(roundYen(1.4)).toBe(1);
    expect(roundYen(1.5)).toBe(2);
    expect(roundYen(2.5)).toBe(3);
  });

  it("マイナスもプラスと対称に丸める", () => {
    expect(roundYen(-1.5)).toBe(-2);
    expect(roundYen(-1.4)).toBe(-1);
    // -0 にならない
    expect(Object.is(roundYen(-0.2), 0)).toBe(true);
  });

  it("小数の誤差で境目を外さない", () => {
    // 1.005 * 1000 = 1004.9999999999999 になる
    expect(roundYen(1.005 * 1000)).toBe(1005);
  });

  it("有限でない値は丸めない", () => {
    expect(() => roundYen(Number.NaN)).toThrow(RangeError);
    expect(() => roundYen(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });
});

describe("お金の計算", () => {
  it("足し算と引き算", () => {
    expect(addYen(yen(100), yen(250), yen(-50))).toBe(300);
    expect(addYen()).toBe(0);
    expect(subYen(yen(100), yen(250))).toBe(-150);
  });

  it("割合をかけたら丸める", () => {
    // 違約金：残りのリース料の1割（2026-11-18 判断）
    expect(mulYen(yen(123_455), 0.1)).toBe(12_346);
  });
});
