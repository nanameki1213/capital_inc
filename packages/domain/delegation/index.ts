import type { System } from "../contracts";

/** 権限移譲。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const delegationSystem: System = (state) => ({ state, events: [] });
