// domain の入口。application はここからだけ import する。
export type { GameEvent, GameState, System, SystemOutput, TickContext } from "./contracts";
export * from "./shared";
export { botSystem } from "./bot";
export { customerVisitSystem, reputationSystem } from "./customer";
export { storeOperationSystem } from "./store";
export { staffSystem } from "./staff";
export { financeSystem } from "./finance";
export { menuSystem } from "./menu";
export { paperSystem } from "./paper";
export { productionSystem } from "./production";
export { corporateSystem } from "./corporate";
export { delegationSystem } from "./delegation";
export { synergySystem } from "./synergy";
