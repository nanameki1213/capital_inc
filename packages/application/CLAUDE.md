# packages/application

プレイヤー操作の処理、ティックの進行、外部とのやり取りの窓口（ポート）の定義（`docs/architecture.md` 5.2）。

## 責任
- `contracts/`：Command の型。**オーナー管理。**
- `ports/`：ポートのインターフェース。**オーナー管理。**
- `commands/`：Command ごとの処理。domain の関数を呼んで状態を更新する。
- `simulation/`：`tick` と `advance`。systems を呼ぶ順番は、ここの1か所だけで定義する。

## 触ってはいけないもの
- ゲームのルールを自分で計算しない（domain に置く）。
- ポートの実装を持たない（adapters に置く）。
- `tick` と `advance` は同期処理。実時間と `Math.random()` は使わない。
- import してよいのは domain だけ。
