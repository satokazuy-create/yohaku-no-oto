// 音の手紙(S06)の選択肢(設計書§14 S06・§19.1)。
// 定型文はMVP仕様書§12.1bで「設計書のまま採用」と決定済み。

export type LetterSoundId = "rain" | "forest" | "waves" | "fire" | "river";

export const LETTER_SOUNDS: { id: LetterSoundId; label: string }[] = [
  { id: "rain", label: "雨" },
  { id: "forest", label: "森" },
  { id: "waves", label: "波" },
  { id: "fire", label: "焚き火" },
  { id: "river", label: "川" },
];

export const LETTER_PHRASES: string[] = [
  "今日もおつかれさま",
  "元気を出さなくて大丈夫",
  "少しだけ休んでね",
  "言葉にできないけれど、気にかけています",
  "この音を一緒に聴けたらと思いました",
];
