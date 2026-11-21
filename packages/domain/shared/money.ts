import type { Brand } from "./brand";

// お金は円単位の整数で持つ（coding-rules 3章、2026-11-21 判断 A4）。
export type Yen = Brand<number, "Yen">;

export function yen(amount: number): Yen {
  if (!Number.isSafeInteger(amount)) {
    throw new RangeError(`お金は安全な範囲の整数（円）で持つ: ${String(amount)}`);
  }
  // -0 は 0 にそろえる（JSON にすると 0 になり、保存の前後で値が変わって見えるのを防ぐ）。
  const normalized = amount === 0 ? 0 : amount;
  // 検証を通った数だけを Yen として扱うため、ここだけでアサーションを使う。
  return normalized as Yen;
}

export const ZERO_YEN: Yen = yen(0);

export function addYen(...amounts: readonly Yen[]): Yen {
  return yen(amounts.reduce<number>((sum, a) => sum + a, 0));
}

export function subYen(a: Yen, b: Yen): Yen {
  return yen(a - b);
}

/**
 * 割合や倍率をかけたお金を、円に丸める。丸めはこの関数だけで行う（coding-rules 3章）。
 * 丸め方は四捨五入（0.5 は 0 から遠いほうへ）。マイナスの金額でも、プラスと対称になるようにするため。
 */
export function roundYen(value: number): Yen {
  if (!Number.isFinite(value)) {
    throw new RangeError(`丸められない値: ${String(value)}`);
  }
  // 0.1 + 0.2 のような誤差で 0.5 の境目を外さないよう、わずかに寄せてから丸める。
  const abs = Math.abs(value);
  const rounded = Math.floor(abs + 0.5 + Number.EPSILON * abs);
  return yen(value < 0 ? -rounded : rounded);
}

export function mulYen(amount: Yen, rate: number): Yen {
  return roundYen(amount * rate);
}
