// アプリ全体の非機密設定値をここに集約する。ハードコード散在を避けるための分離ポイント。
// 機密値(APIキー等)はここに置かず、環境変数(.env.local)経由で取得すること。

export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME ?? "余白の音";

export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// 設計書§8.1 / MVP仕様書§1 F03:再生時間の選択肢(秒)。10分は第2段階。
export const SESSION_DURATIONS_SEC = [30, 60, 180, 300] as const;

// 設計書§17.2:庭の反映は1日3回まで。
export const GARDEN_DAILY_REFLECT_LIMIT = 3;
