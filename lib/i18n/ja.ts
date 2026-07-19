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
  garden: {
    message: "きょう、雨が一滴、たまりました。",
    backLink: "← ホームへ",
  },
  letter: {
    stepSoundHeading: "音をえらぶ",
    stepPhraseHeading: "ことばをえらぶ",
    stepPreviewHeading: "プレビュー",
    nameLabel: "なまえ(任意・10文字まで)",
    createLinkButton: "リンクをつくる",
    doneHeading: "たねが、とんでいきました。",
    doneNotice: "このリンクを大切な人に送ってください(30日間有効・仮)",
    backLink: "← もどる",
    homeLink: "← ホームへ",
  },
  letterReceive: {
    fromSuffix: "より",
    playButton: "▷ 音をきく(3分)",
    playComingSoon: "音源は準備中です",
    noReplyNotice: "※返信は不要です",
    aboutLink: "余白の音について",
  },
  safety: {
    footerLink: "安心して使うために",
    heading: "安心して使うために",
    disclaimer: "このアプリは医療・診断・治療を目的としていません。",
    contactsHeading: "つらいときは、ひとりで抱えなくて大丈夫です。",
    contactsNotice: "電話番号・受付時間は変更されることがあります。発信前に必ずご自身で最新情報をご確認ください。",
    privacyHeading: "プライバシーポリシー・利用規約",
    privacyNotice: "準備中です。一般公開までに掲載します。",
    backLink: "← ホームへ",
  },
  onboarding: {
    message: "音は静かに始まります。いつでも止められます。",
    startButton: "はじめる",
  },
} as const;
