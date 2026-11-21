import type { System } from "../contracts";

/** 客の来店。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const customerVisitSystem: System = (state) => ({ state, events: [] });

/** 評判。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const reputationSystem: System = (state) => ({ state, events: [] });
