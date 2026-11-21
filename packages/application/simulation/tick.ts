import type { GameEvent, GameState, System, TickContext } from "@capital-inc/domain";
import { TICK_SYSTEMS } from "./systems";

export interface Result {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
}

/** systems を順に呼び、前の system が返した状態を次に渡す。起きたことは呼んだ順に並べる。 */
export function runSystems(systems: readonly System[], state: GameState, ctx: TickContext): Result {
  let current = state;
  const events: GameEvent[] = [];
  for (const system of systems) {
    const output = system(current, ctx);
    current = output.state;
    events.push(...output.events);
  }
  return { state: current, events };
}

/** 1週間進める。systems を決まった順に呼んだあと、週を1つ進める。同期処理（coding-rules 6章）。 */
export function tick(state: GameState, ctx: TickContext): Result {
  const result = runSystems(TICK_SYSTEMS, state, ctx);
  return { state: { ...result.state, week: result.state.week + 1 }, events: result.events };
}

/** ticks 週ぶん早送りする。オフライン進行や自動モードで使う（architecture 5.2、5.4）。 */
export function advance(state: GameState, ticks: number, ctx: TickContext): Result {
  if (!Number.isSafeInteger(ticks) || ticks < 0) {
    throw new RangeError(`進める週の数は 0 以上の整数: ${String(ticks)}`);
  }
  let current = state;
  const events: GameEvent[] = [];
  for (let i = 0; i < ticks; i++) {
    const result = tick(current, ctx);
    current = result.state;
    events.push(...result.events);
  }
  return { state: current, events };
}
