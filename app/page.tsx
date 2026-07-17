import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { getGreeting } from "@/lib/greeting";
import { ja } from "@/lib/i18n/ja";

// S01ホームの静的UI第1試作(設計書§14)。モックデータ・ローカル完結。
// S02(気分選択)・S03(再生)・S05(庭)・S06(音の手紙)は未実装のため、
// 遷移先が必要なボタンはすべて disabled にしてある(実装フェーズで解除する)。
export default function Home() {
  const greeting = getGreeting();

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-between gap-10 bg-[#FAF6EF] px-6 py-16 font-serif text-[#4a4a4a]">
      <div aria-hidden="true" />

      <section className="flex flex-col items-center gap-4 text-center">
        <Kuu className="kuu-float" />
        <p className="text-base">{greeting}</p>
      </section>

      <section className="flex w-full flex-col items-center gap-3">
        <Button variant="primary" disabled>
          {ja.home.omakaseButton}
        </Button>
        <p className="text-[11px] text-[#a8a8a8]">{ja.home.audioNotice}</p>
        <Button variant="text" disabled>
          {ja.home.chooseSelfLink}
        </Button>
      </section>

      <div className="h-px w-full bg-[#e5ddd0]" aria-hidden="true" />

      <nav aria-label="ホームの入口" className="flex w-full items-center justify-between px-2">
        <Button variant="icon" disabled aria-label={`${ja.home.gardenEntry}(${ja.home.comingSoon})`}>
          <span aria-hidden="true">🌿</span>
          {ja.home.gardenEntry}
        </Button>
        <Button variant="icon" disabled aria-label={`${ja.home.letterEntry}(${ja.home.comingSoon})`}>
          <span aria-hidden="true">✉</span>
          {ja.home.letterEntry}
        </Button>
        <Button variant="icon" disabled aria-label={`${ja.home.settingsLabel}(${ja.home.comingSoon})`}>
          <span aria-hidden="true">⚙</span>
        </Button>
      </nav>
    </main>
  );
}
