# packages/content

マスターデータ（メニュー、原価、業態、立地、設備など）の JSON を `data/` に置く。**データだけを持ち、コードを持たない**（`docs/architecture.md` 3章）。

## 守ること
- バランスに関わる数値は、コードに直書きせずここに置く（`docs/coding-rules.md` 2章）。
- 検証は adapters の `content/` が Zod で行う。
- 業態名・店名・設備名は架空の一般名詞にする。実在のチェーン名や製品名は使わない（`docs/game-design.md` 5.5）。
