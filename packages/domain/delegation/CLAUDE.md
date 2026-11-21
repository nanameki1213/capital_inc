# packages/domain/delegation

権限移譲。いまの1ティックの順番には入っていない。設計：#4。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
