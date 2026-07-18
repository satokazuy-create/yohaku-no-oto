// 気分の5択(設計書§8.3 F02)と、静的UI試作用の仮の音源・字幕マッピング。
// 実際のレコメンドロジック(時間帯×気分×履歴)は設計書§23で実装フェーズに対応する。

export type MoodId = "quiet" | "relief" | "lonely" | "sleep" | "none";

export const MOOD_ORDER: MoodId[] = ["quiet", "relief", "lonely", "sleep", "none"];

export const MOOD_LABEL: Record<MoodId, string> = {
  quiet: "静かになりたい",
  relief: "ほっとしたい",
  lonely: "ひとりでいたくない",
  sleep: "眠る準備をしたい",
  none: "何も選びたくない",
};

// §16.2のMVP音源セットに対応する仮の表示名(音は未実装・見た目のみ)
export const MOOD_MOCK_SOUND: Record<MoodId, string> = {
  quiet: "雨の音",
  relief: "森の音",
  lonely: "焚き火の音",
  sleep: "湯船の音",
  none: "雨の音",
};

export const MOOD_MOCK_CAPTION: Record<MoodId, string> = {
  quiet: "なにも しなくて いい",
  relief: "そのままで だいじょうぶ",
  lonely: "ひとりじゃない じかん",
  sleep: "ゆっくり めを とじて",
  none: "なにも しなくて いい",
};

export function isMoodId(value: string | null): value is MoodId {
  return !!value && (MOOD_ORDER as string[]).includes(value);
}
