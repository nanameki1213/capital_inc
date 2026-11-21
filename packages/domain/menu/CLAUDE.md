# packages/domain/menu

メニューと価格。いまの1ティックの順番には入っていない（価格とメニューは、ほかの system が読むデータとして使う）。設計：`docs/design/menu-and-pricing.md`（#16）。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
