// 仮の契約。#2 の contracts の設計が承認されたら、この中身を置き換える（2026-11-21 判断 A2）。
// ここはオーナー管理のフォルダ。仮の型も、骨組みに必要な最小限だけにしている。

/** ゲームの状態。いまは経過した週の数だけ。 */
export interface GameState {
  /** 経過した週の数（1ティック＝1週間：architecture 7章）。 */
  readonly week: number;
}

/** 1ティックのあいだに起きたこと。中身は #2 で決める。 */
export type GameEvent = never;

/** system に渡す、そのティックの前提（マスターデータ、乱数など）。中身は #2 で決める。 */
export type TickContext = Readonly<Record<string, never>>;

export interface SystemOutput {
  readonly state: GameState;
  readonly events: readonly GameEvent[];
}

/** 各機能がティックごとに公開する関数の形（architecture 5.1）。 */
export type System = (state: GameState, ctx: TickContext) => SystemOutput;
