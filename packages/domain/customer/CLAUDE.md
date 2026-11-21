# packages/domain/customer

客の来店。1ティックの2番目（客の来店）と5番目（評判：`reputationSystem`）に呼ばれる。設計：`docs/design/customers-and-reputation.md`（#15）、`docs/design/store-location.md`（#13）。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
