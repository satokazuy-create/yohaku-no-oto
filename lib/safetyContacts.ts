// S11「安心して使うために」の相談窓口一覧(MVP仕様書§12.1:全国共通の窓口のみ掲載)。
//
// 電話番号・受付時間はここには記載しない。相談窓口の電話番号を誤って掲載すると、
// 危機的状況にある利用者を誤った連絡先に導く重大なリスクがあるため、
// AIの記憶からの推測値を書かない。公開前に運営者が公式サイトで一次情報を確認し、
// number/hours を埋めること。
//
// 2026-07-19時点:number/hoursが確定するまで、S11画面には本データではなく
// ja.safety.contactsProvisional(暫定案内文)を表示している。確定後にこのデータを
// safety/page.tsx から再度参照する形に戻す。
export type SafetyContact = {
  name: string;
  number: string | null; // 確認済みの番号が入るまで null のまま
  hours: string | null;
  url: string | null;
};

export const SAFETY_CONTACTS: SafetyContact[] = [
  { name: "いのちの電話", number: null, hours: null, url: null },
  { name: "よりそいホットライン", number: null, hours: null, url: null },
];
