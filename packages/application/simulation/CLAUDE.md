# packages/application/simulation

`tick`（1週間進める）と `advance`（早送り）。systems を呼ぶ順番は `systems.ts` の1か所だけで決める（`docs/architecture.md` 5.2）。

## 触ってはいけないもの
- 順番を変えない。変えるときは issue で提案する。
- ゲームのルールをここで計算しない。週を1つ進めること以外は、domain の system に置く。
- 同期処理のまま保つ。実時間と `Math.random()` は使わない。
