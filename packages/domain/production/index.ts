import type { System } from "../contracts";

/** まとめて作る工場（セントラルキッチン）。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const productionSystem: System = (state) => ({ state, events: [] });
