# 圏論入門講義 · Slidev 雛形

人間が Markdown で本文を書き、Codex が Vue / SVG で図を作るための基盤です。
2〜3時間の講義を今後組み立てる前提で、完成した講義内容は入れていません。

初期表示は **6枚**（タイトル、4部の目次、通常本文、左右2カラム、大きな図、段階表示）です。
`slides/02-*.md` 以降は章タイトルと TODO だけの候補棚で、まだ読み込んでいません。

## 起動する

Node.js **22.12 以上**が必要です。このプロジェクトでは Node.js 24 を使っています。

```bash
npm install
npm run dev
```

表示されるローカル URL（通常は <http://localhost:3030>）をブラウザで開きます。
Markdown や CSS の変更は自動反映されます。終了はターミナルで `Ctrl+C`。

```bash
npm run build       # dist/ に静的サイトを出力
npm run typecheck   # 自作 Vue / TypeScript の型チェック
```

`package-lock.json` を保存して再現可能にしています。クリーン環境で同じ依存を入れる場合は `npm ci` を使えます。
Slidev / Vue 以外に図用・アニメーション用ライブラリは追加していません。
`package.json` の `floating-vue: 5.2.2` override は、Slidev 内蔵 Twoslash と FloatingVue 5.4 の起動時互換性エラーを避けるための固定です。Slidev 更新時は、解除後にブラウザの console も確認してください。

## 新しいスライドを1枚追加する

対応する章（例：`slides/01-sets-and-maps.md`）の末尾に、空行を挟んで次を追加します。
**1枚ごとのファイル作成や Vue の編集は不要です。**

```md
---

# 新しいスライドのタイトル

ここに本文を書きます。

- 要点を一つ
- もう一つ

<!--
話す要点や補足を自由にメモ。
-->
```

`---` がスライドの区切りです。レイアウトを省略すると `default` になります。
前のスライドのレイアウトは引き継ぎません。

レイアウトを指定する場合は、区切りに続けて YAML を書きます。

```md
---
layout: center
---

# 何を保つ写像だろう？

$$
f : A \to B
$$
```

タイトルの左上位置・本文幅・文字サイズなどは共通 CSS に任せます。

## 章を追加・採用・並べ替える

1. `slides/` の既存の候補章を編集するか、意味の分かる名前で章の `.md` を追加します。
2. ルートの `slides.md` の末尾に、次の読み込みブロックを追加します。

```md
---
src: ./slides/04-categories.md
---
```

章内の全スライドが、その位置に読み込まれます。
`src:` を含むブロック全体の移動で章の順序を変更でき、削除すれば表示対象から外せます。
ファイル名の数字は管理用です。**表示順は `slides.md` の読み込み順**で決まります。
章内の順序は `---` で区切られたスライドのブロックを移動して変えます。

最初の YAML には全体設定と `src: ./slides/00-title.md` が同居しています。
表紙を入れ替えるときも、`aspectRatio` などの全体設定は残してください。
`src:` があるブロックに本文を併記せず、本文は読み込み先の章に書きます。

4部構成は仮の構成です。目次は `slides/00-title.md` の通常の番号付きリストを編集します。
細かな章を追加しても目次は自動で増えません。

| 部 | 章の候補 |
| --- | --- |
| 集合と写像 | 01 集合と写像、02 関係と部分集合、03 順像と逆像 |
| 圏・函手・自然変換 | 04 圏、05 函手、06 自然変換 |
| 普遍性・米田 | 07 極限と引き戻し、08 随伴、09 米田 |
| その先 | 10 前層と層、11 グロタンディーク構成、12 エンドとコエンド、13 Kan 拡張、14 モナド |

後半の章は削除・不採用を前提にした候補です。初期の6枚だけを見る場合は、そのままにしてください。

## レイアウト

| `layout` | 用途 |
| --- | --- |
| `default` | 左上にタイトル、下に読みやすい幅の本文 |
| `center` | メッセージ・問い・数式を中央配置 |
| `two-cols` | 共通タイトルの下に説明と図を左右配置 |
| `full` | タイトルと最小限の余白で図を大きく表示 |

左右2カラムは次のように書きます。`::left::` と `::right::` はこのプロジェクトのレイアウトのスロットです。

```md
---
layout: two-cols
---

# 集合と写像

::left::

集合 $A$ の各要素に、行き先を一つずつ与えます。

::right::

<MapDiagram />
```

説明と図を逆にする場合は、左右の本文を入れ替えます。
比率は `styles/theme.css` の `--columns-left` / `--columns-right`、間隔は `--column-gap` で変更できます。

## 図を呼び出す・追加する

Markdown には一行だけ書きます。既定の内容を使うために props を指定する必要はありません。

```md
<MapDiagram />
```

```md
<MapBuildAnimation />
```

- 新しい静止図：`components/diagrams/InverseImageDiagram.vue` など。
- 新しい連続変形・段階表示：`components/animations/`。
- 必要な内部共通部品：`components/common/`。

Slidev がサブディレクトリも含めて自動登録するため、追加した `InverseImageDiagram.vue` は `<InverseImageDiagram />` と呼べます。
同じファイル名の component を複数作らないでください。
`PullbackDiagram` / `YonedaDiagram` などは未実装です。必要になった段階で Codex に追加を依頼します。

既存の写像は静止画と動画で `common/MapScene.vue` を共有しています。
点の対応・座標はここに、線幅・色・字形・動作時間は CSS にあります。
SVG の `viewBox` により2カラムにも全画面にも対応します。

手描き感は通常 SVG の楕円の傾きと丸い線端で付けています。
`--diagram-set-tilt: 0deg` で傾きをなくせます。
より手描きの線が必要になった図だけ `npm install roughjs` で Rough.js を追加し、専用 component 内で使用してください。
既存の通常 SVG を一括置換する必要はありません。Rough.js を使う場合は seed を固定し、線のスタイルは CSS 変数から受け取る方針です。

## 段階表示と連続変形

本文の段階表示は Slidev 標準の `v-click` / `v-clicks` を使います。

```md
<v-click>

最初のクリックで現れる説明。

</v-click>

<v-click>

次のクリックで現れる説明。

</v-click>
```

```md
<v-clicks>

- 最初の要点
- 次の要点

</v-clicks>
```

絶対クリック番号を指定する場合は `<div v-click="3">3回目で表示</div>` と書けます。
次へは右矢印・Space、戻るには左矢印を使います。

サンプル6枚目では、次の **7クリック**で図が完成します。

1. a, b, c
2. 1, 2, 3
3. 集合の囲みと A / B のラベル（点が少し広がる）
4. a → 1
5. b → 1
6. c → 3
7. f : A → B

`MapScene.vue` の `v-click` が可視性を管理し、Slidev の `$clicks` が点の位置変更を制御します。
`styles/diagrams.css` の CSS transition が点の移動と矢印の描画を補間します。
`setTimeout` に依存しないため、クリックを戻す・直接そのページを開く操作にも対応します。
動作時間は `--motion-fast` / `--motion-normal` で変更します。OS の「動きを減らす」設定では時間を0にします。

将来の図でも、点・集合の位置を Vue の状態や `$clicks` から求め、SVG の transform と CSS transition で変形できます。
`env.d.ts` は、このプロジェクトで使う Slidev の template 変数 `$page` / `$clicks` を型宣言しています。

## 発表者ノート

各スライドの**最後**に HTML コメントを書きます。書式は自由です。

```md
<!--
要点：行き先は一つ。
注意：同じ行き先を持つ要素はあってよい。
補足：時間があれば別の例を挙げる。
-->
```

発表者画面は <http://localhost:3030/presenter/> です。
コメントはスライド本文には出ません。章の TODO コメントも、採用すると発表者ノートになります。
サンプルの表紙と最後のスライドに短い例があります。

## 数式とコード

インライン数式は `$f : A \to B$`、独立した数式は次の形です。

```md
$$
A=\{a,b,c\},\qquad f:A\to B
$$
```

数式は Slidev 標準の KaTeX を使います。Markdown の `\[ ... \]` より `$$ ... $$` を基本にしてください。
数式の大きさは `--font-size-math` でまとめて変えられます。

コードは通常の fenced code block に言語名を付けます。専用 component は不要です。

````md
```sql
SELECT name FROM objects;
```

```java
record Arrow(String source, String target) {}
```

```ts
const f = { a: 1, b: 1, c: 3 }
```
````

Slidev 標準の Shiki がハイライトします。コード書体・大きさは `--font-code` / `--font-size-code`、余白は `--code-padding` で調整します。

## デザインを変更する

まず **`styles/theme.css`** を開いてください。各スライドに固定値を書く必要はありません。

| 変更するもの | 変数・ファイル |
| --- | --- |
| 本文・見出しの書体 | `--font-body` / `--font-heading` |
| 数式・図中の基本書体 | `--font-math` |
| 文字・見出し・表紙・数式の大きさ | `--font-size-body` / `--font-size-title` / `--font-size-cover` / `--font-size-math` |
| 余白・本文幅 | `--slide-padding-*` / `--content-width` / `--title-gap` |
| 図を主役にするページの余白 | `--full-padding-*` |
| 左右比率と間隔 | `--columns-left` / `--columns-right` / `--column-gap` |
| 色 | `--color-text` / `--color-muted` / `--color-object-a` / `--color-object-b` / `--color-map` / `--color-highlight` |
| 図の線・ラベル・傾き | `--diagram-*` |
| 動作時間 | `--motion-fast` / `--motion-normal` |
| 見出し・段落・コードのルール | `styles/typography.css` |
| レイアウトの余白・配置 | `styles/layouts.css` と `layouts/*.vue` |
| SVG の共通スタイルと動き | `styles/diagrams.css` |

初期フォントは Noto Serif CJK JP → Noto Serif JP → 游明朝 → ヒラギノ明朝 → MS P明朝 → serif のフォールバックです。
インターネット上のフォントを読み込まない設定なので、OS にある明朝体を使います。
環境間で同じ字形に揃える場合は Noto Serif CJK JP を各端末にインストールするか、ライセンスを確認した Web フォントを `public/` に置き、`@font-face` と `--font-body` で指定してください。
KaTeX の数式フォントは Slidev が同梱します。`--font-math` を変えても、数式内部の斜体・大型演算子などの専用フォントは維持します。

色を付ける例：

```css
--color-object-a: #315b78;
--color-object-b: #865225;
--color-map: #363636;
```

A / B の文字、要素名、矢印が残るため、色だけに意味を依存しません。
新しいレイアウトでも白背景・小さな右下のページ番号を共通化するため、既存の小さな `.vue` を参考にします。

## ディレクトリと分業

```text
.
├── slides.md                    # 全体設定・章の読み込み順
├── slides/                      # 人間：本文・章構成・ノート
│   ├── 00-title.md              # タイトル・4部の目次
│   ├── 01-sets-and-maps.md       # レイアウトと図の4枚のサンプル
│   └── 02-*.md … 14-monads.md   # 章ごとの候補棚（未読込）
├── components/                  # Codex：意味のある図・アニメーション
│   ├── diagrams/MapDiagram.vue
│   ├── animations/MapBuildAnimation.vue
│   └── common/                  # MapScene.vue / SlideNumber.vue
├── layouts/                     # default / center / two-cols / full
├── styles/
│   ├── index.ts                 # CSS の読込入口
│   ├── theme.css                # 共通変数
│   ├── typography.css
│   ├── layouts.css
│   └── diagrams.css
├── public/                      # 今後必要になる画像やフォント
├── env.d.ts                     # Slidev の template 変数の型
├── tsconfig.json
├── package.json
├── package-lock.json
├── .nvmrc
├── AGENTS.md                    # Codex の編集ルール
└── README.md
```

人間は `slides/*.md` に本文とノートを書き、Codex には「この写像の逆像を図で説明する component を追加して」のように依頼できます。
Codex は主に `components/`・`layouts/`・`styles/` を編集し、本文の大幅変更は明示的に頼まれたときに行います。

参考：[Slidev の構文](https://sli.dev/guide/syntax)、[章ファイルの読込](https://sli.dev/features/importing-slides)、[クリックアニメーション](https://sli.dev/guide/animations)、[コンテキスト変数](https://sli.dev/guide/global-context)。
