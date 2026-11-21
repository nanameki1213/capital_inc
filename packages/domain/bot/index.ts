import type { System } from "../contracts";

/** 競合 bot の行動。まだ何もしない（中身は設計 issue の承認後に作る）。 */
export const botSystem: System = (state) => ({ state, events: [] });
