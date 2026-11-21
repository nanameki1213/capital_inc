# packages/domain

ゲームのルール。状態の型と、状態を計算する**純粋関数**だけを置く（`docs/architecture.md` 3章、5.1）。

## 責任
- `contracts/`：GameState、GameEvent、マスターデータの型。**オーナー管理。承認なしに変更しない。**
- `shared/`：共通の型とユーティリティ（ID、お金、丸め、シード付き乱数）。
- 機能フォルダ（`store/`、`customer/` など）：ティックごとに呼ばれる system。

## 触ってはいけないもの
- どのパッケージも import しない。外部ライブラリも原則使わない。
- I/O、ブラウザ、実時間（`Date.now()`、`new Date()`）、`Math.random()` に触れない。乱数は `ctx` 経由のシード付きのものだけ。
- 引数の状態を書き換えない。新しい状態を返す。
- 機能フォルダどうしは import しない。共有してよいのは `contracts/` と `shared/` だけ。
- 非同期処理を入れない。
