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
