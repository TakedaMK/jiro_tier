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

### 手動構築手順

プロジェクト名にスペースが含まれていたため、手動で React + TypeScript 環境を構築しました。

#### 1. プロジェクト初期化

- プロジェクト名にスペースが含まれていたため、Create React App が使用できませんでした
- 手動で React + TypeScript 環境を構築しました

#### 2. 設定ファイルの作成

- `package.json`: React + TypeScript の依存関係を定義
- `tsconfig.json`: TypeScript の設定
- `public/index.html`: HTML テンプレート
- `src/index.tsx`: アプリケーションのエントリーポイント
- `src/App.tsx`: メインコンポーネント
- `src/index.css`: グローバル CSS
- `src/App.css`: App コンポーネント用 CSS
- `.gitignore`: Git 管理から除外するファイルを定義

#### 3. 依存関係のインストール

```bash
npm install
```

#### 4. 開発サーバーの起動

```bash
npm start
```

#### 5. Git 管理の設定

- `.gitignore`ファイルを作成し、`node_modules/`を除外
- 不要なファイル（ログ、ビルドファイル、環境変数ファイルなど）も除外

## 使用技術

- React 18.2.0
- TypeScript 4.7.4
- React Scripts 5.0.1

## 開発コマンド

- `npm start`: 開発サーバーを起動
- `npm run build`: プロダクションビルドを作成
- `npm test`: テストを実行
- `npm run eject`: Create React App の設定を展開（非推奨）

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

## Git 管理から除外されるファイル

- `node_modules/`: 依存関係のパッケージ
- `build/`, `dist/`: ビルドファイル
- `.env*`: 環境変数ファイル
- ログファイル、キャッシュファイル
- IDE 設定ファイル
