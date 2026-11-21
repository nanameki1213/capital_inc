import type { GameState, System, TickContext } from "@capital-inc/domain";
import { describe, expect, it } from "vitest";
import { advance, runSystems, tick } from "./tick";

const ctx: TickContext = {};
const start: GameState = { week: 0 };

describe("tick", () => {
  it("週を1つ進める", () => {
    expect(tick(start, ctx).state.week).toBe(1);
  });

  it("引数の状態を書き換えない", () => {
    const frozen = Object.freeze({ ...start });
    tick(frozen, ctx);
    expect(frozen.week).toBe(0);
  });
});

describe("runSystems", () => {
  it("決めた順に呼び、前の system の結果を次に渡す", () => {
    const calls: string[] = [];
    const record =
      (name: string): System =>
      (state) => {
        calls.push(`${name}@${String(state.week)}`);
        return { state: { week: state.week + 10 }, events: [] };
      };
    const result = runSystems([record("a"), record("b"), record("c")], start, ctx);
    expect(calls).toEqual(["a@0", "b@10", "c@20"]);
    expect(result.state.week).toBe(30);
  });
});

describe("advance", () => {
  it("n 週進めると、tick を n 回呼んだのと同じになる", () => {
    let byTick = start;
    for (let i = 0; i < 30; i++) byTick = tick(byTick, ctx).state;
    expect(advance(start, 30, ctx).state).toEqual(byTick);
  });

  it("0 週なら何も変わらない", () => {
    expect(advance(start, 0, ctx)).toEqual({ state: start, events: [] });
  });

  it("負の数や小数は受け付けない", () => {
    expect(() => advance(start, -1, ctx)).toThrow(RangeError);
    expect(() => advance(start, 1.5, ctx)).toThrow(RangeError);
  });
});
