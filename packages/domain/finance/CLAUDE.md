# packages/domain/finance

お金。1ティックの6番目（最後）に呼ばれる。利益、CF、減価償却、リース、倒産の判定を受け持つ。設計：`docs/design/store-pl.md`（#18）、`docs/design/week-progression.md`（#12）。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
