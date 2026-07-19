import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";

// S12初回オンボーディングの静的UI試作(設計書§12・§13)。1画面のみ、登録・年齢確認なし。
// 「初回のみ表示」の自動判定(localStorage等)は未実装。このルートを直接開けば確認できる。
export default function OnboardingPage() {
  return (
    <main className="safe-bottom flex min-h-screen flex-1 flex-col items-center justify-center gap-8 bg-[#FAF6EF] px-6 py-16 pb-20 text-center font-serif text-[#3d3833]">
      <Kuu className="kuu-float" />
      <p className="max-w-xs text-base leading-relaxed">{ja.onboarding.message}</p>
      <Button variant="primary" href="/">
        {ja.onboarding.startButton}
      </Button>
    </main>
  );
}
