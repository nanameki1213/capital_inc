import {
  botSystem,
  customerVisitSystem,
  financeSystem,
  reputationSystem,
  staffSystem,
  storeOperationSystem,
  type System,
} from "@capital-inc/domain";

/**
 * 1ティックで呼ぶ systems の順番。順番はこの1か所だけで決める（architecture 5.2、2026-11-17 判断、#12）。
 * 変えるときは issue で提案する。
 */
export const TICK_SYSTEMS: readonly System[] = [
  botSystem, // 1. 競合 bot の行動
  customerVisitSystem, // 2. 客の来店
  storeOperationSystem, // 3. 売上と費用
  staffSystem, // 4. 店員と店長（士気、店長の成長）
  reputationSystem, // 5. 評判
  financeSystem, // 6. お金
];
