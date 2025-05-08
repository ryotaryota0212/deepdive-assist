# DeepDive Assist

深掘りアシストは、映画・アニメ・小説・ゲームなどの体験した作品を記録し、AIが多角的に深掘りすることで気付き・学びへ昇華できるアプリケーションです。

## セットアップと実行方法

### バックエンドのセットアップ
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### フロントエンドのセットアップ
```bash
npm install
npx expo start
```

**重要**: Expo Goでアプリを使用する前に、バックエンドサーバーが実行されている必要があります。アプリは`src/config/api.ts`で設定されたURLでバックエンドにアクセスします。

## 機能

- 作品のキャプチャ（映画、アニメ、書籍、ゲーム、音楽など）
- メモと感情ログの記録
- AIによる即時サマリー生成
- 深掘りセッションによる作品の多角的な分析
- 関連作品のレコメンド

## 技術スタック

### フロントエンド
- React Native (Expo)
- React Navigation
- React Native Paper

### バックエンド
- FastAPI
- SQLAlchemy
- Supabase (PostgreSQL + pgvector)
- LangChain + OpenAI

## 開発者向け情報

ローカル開発環境では、バックエンドサーバーのURLが`src/config/api.ts`ファイルで設定されています。デフォルトでは`http://localhost:8000`に設定されていますが、Expo Goで物理デバイスからテストする場合は、開発マシンのIPアドレスに変更する必要があります。
