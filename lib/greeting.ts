import { ja } from "./i18n/ja";

// S01ホームの1行挨拶(設計書§14)。時間帯で変化する。
export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return ja.home.greetingMorning;
  if (hour >= 11 && hour < 17) return ja.home.greetingDay;
  return ja.home.greetingEvening;
}
