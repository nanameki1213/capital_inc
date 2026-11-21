# packages/domain/paper

新聞。いまの1ティックの順番には入っていない。順番に足すときは issue で提案する（architecture 5.2）。設計：#24。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
