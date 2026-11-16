# ソフトウェアアーキテクチャ

ゲームのソフトウェア構成と、モジュール間のルールをまとめたドキュメントです。
このファイルはオーナーが管理します。変更したいときは、issueで提案してください。

---

## 1. 方針

**クリーンアーキテクチャの依存ルール ＋ 関数型のコア** を採用する。

- 依存の向きは、必ず**外側から内側**だけ。内側（ゲームのルール）は、外側（UI、保存、データの読み込み、ブラウザ）を一切知らない。
- 一番内側の domain は、**純粋関数だけ**で作る。「状態を受け取って、新しい状態を返す」形にする。
- Webアプリ向けのクリーンアーキテクチャをそのまま持ち込まない。具体的には、次のものは作らない。
  - エンティティごとのクラスやRepository
  - 操作1つにつき1つのユースケースクラス
  - 層をまたぐたびに行う、データの詰め替え（DTO変換）。ただし、UIに渡す表示用データだけは例外とする。

### この方針にする理由

- **ゲームのルールを守りやすい**：ルールが domain に集まり、テストしやすく、オーナーのレビュー対象もはっきりする。
- **LLMで分業しても壊れにくい**：依存の向きと機能の境界を機械でチェックでき、担当範囲もフォルダ単位で切れる。
- **外側を差し替えやすい**：UIの作り直し、シミュレーションのWeb Worker化、オフライン進行の早送り計算、保存先の変更などを、domain に触らずに行える。

---

## 2. 技術スタック

| 用途 | 採用するもの |
|---|---|
| 言語 | TypeScript |
| パッケージ管理 | pnpm workspaces |
| UI | React + Vite |
| テスト | Vitest |
| データ検証 | Zod |
| Lint / 整形 | ESLint, Prettier |
| 依存関係の境界チェック | dependency-cruiser |

---

## 3. 層の構成

```
        ┌──────────────────────────────┐
        │ app（フレームワーク・ドライバ） │  React、ゲームループ、Web Worker、組み立て
        │  ┌────────────────────────┐  │
        │  │ adapters（変換）        │  │  表示用データ、保存の実装、データ読み込み
        │  │  ┌──────────────────┐  │  │
        │  │  │ application       │  │  │  プレイヤー操作の処理、ティックの進行、ポート
        │  │  │  ┌────────────┐  │  │  │
        │  │  │  │ domain      │  │  │  │  ゲームのルール（純粋関数）
        │  │  │  └────────────┘  │  │  │
        │  │  └──────────────────┘  │  │
        │  └────────────────────────┘  │
        └──────────────────────────────┘
```

| 層 | パッケージ | 責任 | やってはいけないこと |
|---|---|---|---|
| domain | `packages/domain` | ゲームのルール。状態の型と、状態を計算する純粋関数 | 外部（I/O、ブラウザ、実時間、`Math.random()`）に触れる。外側の層を import する |
| application | `packages/application` | プレイヤー操作の処理、ティックの進行（systemsを呼ぶ順番）、外部とのやり取りの窓口（ポート）の定義 | ゲームのルールを自分で計算する。ポートの実装を持つ |
| adapters | `packages/adapters` | 表示用データへの変換、保存の実装、マスターデータの読み込みと検証 | ゲームのルールを計算する。React に依存する |
| app | `packages/app` | 画面（React）、ゲームループ、Web Worker、全体の組み立て | ゲームのルールを計算する。domain を直接 import する |

マスターデータ（メニュー、原価、業態、客の好みなどのJSON）は `packages/content` に置く。このパッケージはデータだけを持ち、コードを持たない。

---

## 4. 依存のルール

```
app ──→ adapters ──→ application ──→ domain
 └────────────────→ application
```

- 依存してよいのは、上の矢印の向きだけ。
- **app は domain を直接 import しない**。画面は adapters が作る表示用データ（ViewModel）だけを使い、操作は application のコマンドとして送る。
- domain は、どのパッケージも import しない（外部ライブラリも原則として使わない）。
- このルールは dependency-cruiser で機械的にチェックし、CIで違反を止める。

---

## 5. 各層の中身

### 5.1 domain

```
packages/domain/
├── contracts/       GameState、GameEvent、マスターデータの型 ※オーナー管理
├── shared/          共通の型とユーティリティ（ID、お金、丸め、シード付き乱数）
├── store/           店舗の運営（営業、席、回転）
├── customer/        客の来店と満足度
├── menu/            メニューと価格
├── staff/           従業員
├── procurement/     仕入れ
├── production/      まとめて作る工場（セントラルキッチン）
├── finance/         お金の流れ、利益、倒産判定
├── corporate/       会社の構造、上場、買収
├── delegation/      権限移譲
└── synergy/         業態・会社をまたぐ効率化
```

- 機能のフォルダ（`store/`、`synergy/` など）は、**お互いを import しない**。共有してよいのは `contracts/` と `shared/` だけ。
- 機能どうしのやり取りは、`GameState` と `GameEvent` を通して行う。
- 各機能は、ティックごとに呼ばれる関数を、同じ形で公開する。

```ts
// packages/domain/procurement/index.ts
export function procurementSystem(state: GameState, ctx: TickContext): SystemOutput;
```

- 機能の分け方は、フェーズが進むにつれて増える。新しい機能のフォルダを作るときは、設計issueで提案する。

### 5.2 application

```
packages/application/
├── contracts/       Command（プレイヤー操作）の型 ※オーナー管理
├── ports/           外部とのやり取りの窓口（インターフェース）※オーナー管理
├── commands/        Command ごとの処理。domain の関数を呼んで状態を更新する
└── simulation/      tick と、複数ティックの早送り。systems を呼ぶ順番はここの1か所で定義する
```

中心となる関数:

```ts
function applyCommand(state: GameState, cmd: Command, ctx: CommandContext): Result;
function tick(state: GameState, ctx: TickContext): Result;
function advance(state: GameState, ticks: number, ctx: TickContext): Result; // 早送り

type Result = { state: GameState; events: GameEvent[] };
```

ポートの例:

```ts
interface SaveRepository {
  save(slot: SaveSlotId, state: GameState): Promise<void>;
  load(slot: SaveSlotId): Promise<GameState | null>;
}

interface ContentSource {
  load(): MasterData; // 検証済みのマスターデータ
}
```

- `tick` と `advance` は同期処理にする。非同期になるのは、ポートを使う処理（保存、読み込み）だけ。
- systems を呼ぶ順番を変えるときは、issueで提案する。

### 5.3 adapters

```
packages/adapters/
├── presenters/      GameState → 画面用の ViewModel（表示用の文字列や整形済みの数値を含む）
├── persistence/     SaveRepository の実装（IndexedDB など）
└── content/         packages/content の JSON を Zod で検証し、ContentSource として提供する
```

- presenters は、GameState を読んで ViewModel を返すだけの関数にする。状態を変えない。
- お金の表示（3桁区切り、万・億の表記など）は presenters で行う。

### 5.4 app

```
packages/app/
├── ui/              React のコンポーネント。ViewModel を表示し、Command を送るだけ
├── loop/            ゲームループ（実時間 → ティック数への変換、倍速、一時停止）
├── worker/          シミュレーションを Web Worker で動かす場合の入口
└── main.ts          全体の組み立て（ポートの実装を application に渡す）
```

- 実時間を扱ってよいのは app だけ。app が「何ティック進めるか」を決めて、application に渡す。
- オフライン中の進行は、app が経過時間を計算し、application の `advance` を呼んで実現する。

---

## 6. contracts（契約）

全員が守る「契約書」。**オーナーの承認なしに変更しない**。変更が必要なときは、変更案と理由をissueで提案する。

| 場所 | 内容 |
|---|---|
| `packages/domain/contracts/` | GameState、GameEvent、マスターデータの型 |
| `packages/application/contracts/` | Command の型 |
| `packages/application/ports/` | ポートのインターフェース |

最初から、次のものを表現できるように設計する（フェーズ4で作り直しにならないため）。

- 複数の業態（ブランド）
- 複数の会社（ホールディングスと事業会社）
- 業態や会社をまたいだ、共通の仕入れ・設備
- 権限移譲の状態（誰に、何を任せているか）

---

## 7. 状態の持ち方

- `GameState` は**シリアライズ可能なプレーンデータだけ**で構成する。
- エンティティは ID で参照し合う形にする（例: `stores: Record<StoreId, Store>`）。
- セーブ／ロードは、`GameState` をそのまま JSON にして実現する。
- 1ティックがゲーム内のどれだけの時間かは、設計issueで決める。
- 同じシード・同じ入力なら、必ず同じ結果になること（決定的なシミュレーション）。
- 早送り（`advance`）が遅くなりすぎる場合の対策（粗い計算での早送りなど）は、必要になった時点で設計issueで検討する。

---

## 8. LLMでの分業の進め方

### 8.1 担当の切り方

- 1エージェントには、**1つの層の、1つの機能のフォルダ**を担当させる（例: `packages/domain/procurement/`）。
- 各エージェントは、別のブランチ（可能なら別のgit worktree）で作業する。
- 各パッケージと、domain の各機能のフォルダには短い `CLAUDE.md` を置き、そのモジュールの責任と、触ってはいけないものを書く。

### 8.2 1つの機能を作る順番

1つの機能（例: 仕入れをまとめる）は、層ごとに別のissueに分けて、内側から順に作る。
各層の実装の前に、その層の詳細設計issue（型定義と関数のシグネチャを含む）を立て、オーナーの承認を得る。詳細設計のテンプレートは CLAUDE.md を参照。

1. **domain**：ルールの関数とテスト（オーナーが一番丁寧にレビューする）
2. **application**：Command の処理、systems の呼び出し順への追加
3. **adapters**：表示用データ（ViewModel）
4. **app**：画面

内側が承認されてから、外側に進む。

### 8.3 分業を始める前にそろえるもの

1. contracts（オーナーが承認済み）
2. application の `simulation/` と、中身が空の domain の機能
3. CI（型チェック、lint、依存ルールのチェック、テスト）
