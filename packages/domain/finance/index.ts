import type { System } from "../contracts";

/** お金。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const financeSystem: System = (state) => ({ state, events: [] });
