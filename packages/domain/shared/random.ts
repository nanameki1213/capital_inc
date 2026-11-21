import type { Brand } from "./brand";

/**
 * シード付き乱数の状態。32ビットの整数1つだけなので、GameState に入れてそのまま保存できる。
 * 関数はすべて「状態を受け取り、値と次の状態を返す」形にし、同じシードなら必ず同じ並びになる
 * （architecture 7章：決定的なシミュレーション）。
 * 方式は mulberry32。速く、ゲームのぶれには十分な質がある。暗号には使わない。
 */
export type RngState = Brand<number, "RngState">;

export interface Drawn<T> {
  readonly value: T;
  readonly rng: RngState;
}

function toState(n: number): RngState {
  // 32ビットの符号なし整数に収めたものだけを状態として扱う。
  return (n >>> 0) as RngState;
}

export function createRng(seed: number): RngState {
  if (!Number.isInteger(seed)) {
    throw new RangeError(`シードは整数: ${String(seed)}`);
  }
  return toState(seed);
}

/** 0 以上 1 未満の数を1つ引く。 */
export function nextFloat(rng: RngState): Drawn<number> {
  const next = toState(rng + 0x6d2b79f5);
  let t = next;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, rng: next };
}

/** min 以上 max 以下の整数を1つ引く。 */
export function nextInt(rng: RngState, min: number, max: number): Drawn<number> {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    throw new RangeError(`範囲が正しくない: ${String(min)}..${String(max)}`);
  }
  const drawn = nextFloat(rng);
  return { value: min + Math.floor(drawn.value * (max - min + 1)), rng: drawn.rng };
}

/** 1 を中心に ±spread の倍率を引く（例：spread 0.05 なら 0.95〜1.05。2026-11-21 判断 C3）。 */
export function nextJitter(rng: RngState, spread: number): Drawn<number> {
  if (!(spread >= 0 && spread < 1)) {
    throw new RangeError(`ぶれの幅は 0 以上 1 未満: ${String(spread)}`);
  }
  const drawn = nextFloat(rng);
  return { value: 1 - spread + drawn.value * 2 * spread, rng: drawn.rng };
}
