# packages/domain/store

店舗の運営（売上と費用）。1ティックの3番目に呼ばれる。工事、設備・内装・外装・席、営業の計算を受け持つ。設計：`docs/design/equipment-and-interior.md`（#14）、`docs/design/equipment-by-format.md`（#25）、`docs/design/store-location.md`（#13）。

## 触ってはいけないもの
- ほかの機能フォルダを import しない。使ってよいのは `../contracts` と `../shared` だけ。
- `contracts/` を書き換えない（オーナー管理）。
- 純粋関数だけ。I/O、実時間、`Math.random()`、非同期処理を使わない。引数の状態を書き換えない。
