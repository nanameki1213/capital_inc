# packages/domain/staff

店員と店長（士気、店長の成長）。1ティックの4番目に呼ばれる。設計：`docs/design/staff-and-manager.md`（#17）。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
