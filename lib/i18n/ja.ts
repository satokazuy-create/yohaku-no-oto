// 文言はすべてここに外出しする(設計書§21「多言語」/MVP仕様書§14)。
// コンポーネント側に日本語文字列をハードコードしない。
// くぅの発話カタログ(設計書§15.2)は別途 lib/kuu-lines.ts に実装フェーズで追加する。

export const ja = {
  appName: "余白の音",
  tagline: "こころに羽を。からだに余白を。",
  placeholderNotice: "準備中です。もう少しだけ、お待ちください。",
  home: {
    greetingMorning: "おはようございます。",
    greetingDay: "こんにちは。",
    greetingEvening: "こんばんは。",
    omakaseButton: "くぅにまかせる",
    audioNotice: "音は静かに始まります",
    chooseSelfLink: "じぶんで選ぶ ▾",
    gardenEntry: "庭",
    letterEntry: "音の手紙",
    settingsLabel: "設定",
    comingSoon: "準備中",
  },
  choose: {
    heading: "いまは、どんな感じですか?",
    backLink: "← もどる",
  },
  play: {
    stopButton: "とめる",
    durationOptions: ["1分", "3分", "5分"] as const,
  },
  reflect: {
    heading: "どうでしたか。",
    subheading: "どれを選んでも だいじょうぶ",
    relaxed: "少しゆるんだ",
    same: "変わらない",
    unknown: "わからない",
    skip: "(こたえずに とじる)",
  },
} as const;
