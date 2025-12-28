## 開発環境構築手順

### 通常の手順（推奨）

プロジェクト名にスペースや特殊文字が含まれていない場合：

```bash
# Create React AppでTypeScriptテンプレートを使用してプロジェクトを作成
npx create-react-app my-app --template typescript

# プロジェクトディレクトリに移動
cd my-app

# 開発サーバーを起動
npm start
```

## 使用技術

- React 18.2.0
- TypeScript 4.7.4
- React Scripts 5.0.1
- firebase

## 開発コマンド

- `npm start`: 開発サーバーを起動
- `npm run build`: プロダクションビルドを作成
- `npm test`: テストを実行
- `npm run eject`: Create React App の設定を展開（非推奨）
- `npm run seed-tenpo-data` : 店舗マスタを Firestore Database に投入
- `npm run add-single-tenpo` : 単一の店舗データを Firestore Database に追加

## プロジェクト構造

```
J project/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 単一の店舗データを追加する手順

この手順では、Firestore Database に1つの店舗データだけを追加する方法を説明します。
複数の店舗データを一括で投入する場合は、`npm run seed-tenpo-data` コマンドを使用してください。

### 手順 1: スクリプトファイルを開く

エディタで以下のファイルを開きます：

```
src/scripts/addSingleTenpo.ts
```

### 手順 2: 追加する店舗データを編集する

ファイルを開くと、以下のようなコードが表示されます：

```typescript
// 追加する店舗データ（ここを編集して使用）
const tenpoData = {
  tenpo_CD: 45,
  tenpo_name: "名古屋大曾根",
  rank_CD: 4,
  haishi_flag: 0,
  display_order: 100
};
```

この `tenpoData` オブジェクトの値を、追加したい店舗の情報に変更してください。

#### 各項目の説明

- **`tenpo_CD`**: 店舗コード（数値）。既存の店舗と重複しない一意の番号を指定します。
- **`tenpo_name`**: 店舗名（文字列）。例: "目黒"、"仙川" など。
- **`rank_CD`**: ランクコード（数値）。以下の対応表を参考にしてください。
  - `1` = SSS
  - `2` = SS
  - `3` = S
  - `4` = A+
  - `5` = A
  - `6` = A-
  - `7` = B
  - `8` = C
- **`haishi_flag`**: 廃止フラグ（数値）。通常は `0`（有効）を指定します。`1` は廃止を意味します。
- **`display_order`**: 表示順序（数値）。同じランク内での表示順を指定します。数値が小さいほど先に表示されます。

#### 編集例

例えば、「新宿」という店舗をランク「A」で追加する場合：

```typescript
const tenpoData = {
  tenpo_CD: 46,
  tenpo_name: "新宿",
  rank_CD: 5,  // A は 5
  haishi_flag: 0,
  display_order: 1
};
```

### 手順 3: スクリプトを実行する

ターミナル（コマンドプロンプト）を開き、プロジェクトのルートディレクトリで以下のコマンドを実行します：

```bash
npm run add-single-tenpo
```

### 手順 4: 実行結果を確認する

コマンドを実行すると、以下のようなメッセージが表示されます：

```
Firestore店舗データ追加スクリプトを開始します...
店舗データの追加を開始します: 名古屋大曾根
店舗データを追加しました: 名古屋大曾根 (ID: 45)
店舗データ追加スクリプトが正常に完了しました！
```

このメッセージが表示されれば、データの追加は成功です。

### エラーが発生した場合

エラーメッセージが表示された場合は、以下を確認してください：

1. **Firebase の接続設定**: `src/lib/firebase.ts` の設定が正しいか確認
2. **データの重複**: 同じ `tenpo_name` のデータが既に存在していないか確認
3. **データ形式**: 各項目の型（数値・文字列）が正しいか確認
4. **ネットワーク接続**: インターネットに接続されているか確認

### 注意事項

- 同じ `tenpo_name` のデータが既に存在する場合、既存のデータが上書きされます
- `tenpo_CD` は一意であることが推奨されますが、Firestore のドキュメント ID は `tenpo_name` を使用しているため、`tenpo_name` の重複に注意してください
- 実行前に、追加するデータが正しいか必ず確認してください

## Git 管理から除外されるファイル

- `node_modules/`: 依存関係のパッケージ
- `build/`, `dist/`: ビルドファイル
- `.env*`: 環境変数ファイル
- ログファイル、キャッシュファイル
- IDE 設定ファイル
