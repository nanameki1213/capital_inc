# packages/app

画面（React）、ゲームループ、Web Worker、全体の組み立て（`docs/architecture.md` 5.4）。

## 責任
- `ui/`：ViewModel を表示し、Command を送るだけ。
- `loop/`：実時間 → ティック数への変換。基本は「次の週へ」ボタンで1ティック。
- `main.ts`：ポートの実装を application に渡す。

## 触ってはいけないもの
- **domain を直接 import しない。** 使うのは adapters の ViewModel と application の Command だけ。
- ゲームのルールを計算しない。
- Promise を放置しない（`no-floating-promises`）。
- 実時間を扱ってよいのは、このパッケージだけ。
