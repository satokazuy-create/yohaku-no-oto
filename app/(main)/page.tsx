import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { getGreeting } from "@/lib/greeting";
import { ja } from "@/lib/i18n/ja";

// S01ホームの静的UI試作(設計書§14)。モックデータ・ローカル完結。
// 「くぅにまかせる」は気分選択を経ずに再生へ(mood=none、設計書§23)。
// 「じぶんで選ぶ」はS02気分選択へ、庭はS05へ、音の手紙はS06へ。設定は未実装のためdisabledのまま。
export default function Home() {
  const greeting = getGreeting();

  return (
    <main className="safe-bottom flex min-h-screen flex-1 flex-col items-center justify-between gap-10 bg-[#FAF6EF] px-6 py-16 pb-20 font-serif text-[#3d3833]">
      <div aria-hidden="true" />

      <section className="flex flex-col items-center gap-4 text-center">
        <Kuu className="kuu-float" size={140} />
        <p className="text-base">{greeting}</p>
      </section>

      <section className="flex w-full flex-col items-center gap-3">
        <Button variant="primary" href="/play?mood=none">
          {ja.home.omakaseButton}
        </Button>
        <p className="text-xs text-[#6b6b6b]">{ja.home.audioNotice}</p>
        <Button variant="text" href="/choose">
          {ja.home.chooseSelfLink}
        </Button>
      </section>

      <div className="h-px w-full bg-[#e5ddd0]" aria-hidden="true" />

      <nav aria-label="ホームの入口" className="flex w-full items-center justify-between px-2">
        <Button variant="icon" href="/garden">
          <span aria-hidden="true">🌿</span>
          {ja.home.gardenEntry}
        </Button>
        <Button variant="icon" href="/letter/new">
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
