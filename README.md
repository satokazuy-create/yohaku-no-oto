# 余白の音 (Yohaku no Oto)

短い音体験を通して、忙しい人が「ふと立ち止まる」ことを支えるセルフケアPWA。
YOHAKU Lab の並行プロダクトの一つ。

**現在の状態**: 雛形フェーズ(Next.js + TypeScript + App Router の基本構成のみ)。
Supabase接続・Vercel公開・音源・本格UIはまだ実装していない。

## 技術構成

- Next.js(App Router) / TypeScript / Tailwind CSS
- 今後: Supabase(DB/Auth/Storage) / Vercel(ホスティング) / Howler.js(音再生)

## 開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できる。

## 環境変数

`.env.example` を `.env.local` にコピーして使用する(`.env.local` はgit管理外)。
現時点では未接続のため空でもローカル起動できる。

## ディレクトリ構成(抜粋)

```
app/                # ルーティング(App Router)
components/kuu/     # 「くぅ」の表示(差し替え可能な構成)
components/garden/  # サウンドガーデン描画(未実装)
components/player/  # 音再生エンジン(未実装)
components/ui/      # 共通UIプリミティブ(未実装)
lib/config.ts       # 非機密の設定値
lib/i18n/ja.ts      # 日本語文言辞書
content/sounds/      # 音源メタデータ(未実装)
tests/               # unit / e2e(未実装)
```
