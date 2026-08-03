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

// 実音源を用意できたmoodのみ、content/sounds/sounds.jsonのidを指定する(設計書§16.2)。
// 未対応のmoodはnull(これまでどおり見た目・字幕のみ)。音源を増やすたびにここへ追加する。
// noneはcontentMood解決後には使われない(必ずquiet等のいずれかに解決されるため)が、
// Recordを網羅させるためnullを入れている。
export const MOOD_SOUND_ID: Record<MoodId, string | null> = {
  quiet: "rain",
  relief: null,
  lonely: "campfire",
  sleep: null,
  none: null,
};

export type GardenField = "drops" | "plants" | "flowers" | "sky";

// 気分→庭の変化(設計書§17.2は「聴いた音の種類」で決まるが、実音源カタログが
// 未実装のため、暫定的に気分の仮音源(MOOD_MOCK_SOUND)に対応する形で代用する。
// 雨系→drops、森・風系→plants、朗読言葉系→flowers、ほぼ無音系→sky に相当。
export const MOOD_GARDEN_FIELD: Record<MoodId, GardenField> = {
  quiet: "drops",
  relief: "plants",
  lonely: "flowers",
  sleep: "sky",
  none: "drops",
};

// 「くぅにまかせる」(mood=none)の候補プール(設計書§23「時間帯既定」の簡易版)。
// 本来の時間帯×履歴のレコメンドロジックは未実装のため、既存の気分(quiet/relief/
// lonely/sleep)の音・字幕・庭の変化を時間帯ごとに複数候補として借用する暫定対応。
// lib/greeting.ts の時間帯区分と揃えている。選ばれた結果は必ずこの4つのいずれかに
// 解決し、mood=noneのままDBに残したり庭に反映したりすることはない。
type TimeBucket = "morning" | "day" | "night";

const OMAKASE_CANDIDATES: Record<TimeBucket, MoodId[]> = {
  morning: ["relief", "quiet"], // 朝:森でゆるやかに、または雨でひと休み
  day: ["quiet", "relief"], // 昼:雨でひと休み、または森でゆるやかに
  night: ["sleep", "lonely"], // 夜:湯船でゆっくり、または焚き火でひとりの時間
};

function getTimeBucket(date: Date): TimeBucket {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  return "night";
}

export const OMAKASE_HISTORY_KEY = "yohaku_omakase_last_mood";

// 直前に選ばれた候補(lastMood)を除外して1つ選ぶ、純粋な(副作用のない)関数。
// 「選ぶ」(このファイルで読み取りのみ)と「履歴に保存する」(呼び出し側でuseEffect等
// を使って書き込みのみ)を分離しているのは、React Strict Mode(開発時)がuseStateの
// 遅延初期化関数を2回呼ぶ際、読み取り+書き込みが1つの関数内にまとまっていると
// 1回目の書き込みを2回目が読んでしまい、履歴が壊れる不具合があったため。
export function pickOmakaseMood(date: Date, lastMood: string | null): MoodId {
  const candidates = OMAKASE_CANDIDATES[getTimeBucket(date)];
  const pool = candidates.length > 1 ? candidates.filter((m) => m !== lastMood) : candidates;
  return pool[Math.floor(Math.random() * pool.length)] ?? candidates[0];
}

// pickOmakaseMood用にlocalStorageから直前の履歴を読む(読み取りのみ、副作用なし)。
// localStorageが使えない環境(プライベートモード・SSR等)ではnullを返す。
export function readOmakaseHistory(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(OMAKASE_HISTORY_KEY);
  } catch {
    return null;
  }
}

// 選ばれた結果を履歴として保存する(書き込みのみ)。呼び出し側のuseEffectから呼ぶこと。
export function writeOmakaseHistory(mood: MoodId): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OMAKASE_HISTORY_KEY, mood);
  } catch {
    // 保存できなくても体験は続行する
  }
}
