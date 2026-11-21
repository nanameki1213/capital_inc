# packages/adapters

表示用データへの変換、保存の実装、マスターデータの読み込みと検証（`docs/architecture.md` 5.3）。

## 責任
- `presenters/`：GameState → ViewModel。状態を変えない関数だけ。お金の表示（3桁区切り、万・億）はここで行う。
- `persistence/`：SaveRepository の実装。
- `content/`：`packages/content` の JSON を Zod で検証し、ContentSource として提供する。

## 触ってはいけないもの
- ゲームのルールを計算しない。
- React に依存しない。
- 実時間と `Math.random()` は使わない。
