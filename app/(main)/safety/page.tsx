import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";

// S11「安心して使うために」の静的UI試作(設計書§20)。
// 相談窓口の電話番号は、誤った番号を危機的状況の利用者に案内するリスクを避けるため
// 一次情報を確認するまで掲載しない(2026-07-19実機フィードバックで暫定文言に変更)。
export default function SafetyPage() {
  return (
    <main className="safe-bottom flex min-h-dvh flex-1 flex-col items-center gap-8 bg-[#FAF6EF] px-6 py-16 pb-6 font-serif text-[#3d3833]">
      <p className="w-full max-w-sm rounded-xl border border-[#e5ddd0] bg-[#fff8ee] px-4 py-2 text-center text-xs text-[#6b6b6b]">
        {ja.safety.prototypeNotice}
      </p>

      <h1 className="text-center text-lg">{ja.safety.heading}</h1>

      <p className="max-w-sm text-center text-sm leading-relaxed">{ja.safety.disclaimer}</p>

      <section className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-[#e5ddd0] bg-white p-5">
        <p className="text-sm">{ja.safety.contactsHeading}</p>
        <p className="text-sm leading-relaxed text-[#5a5a5a]">
          {ja.safety.contactsProvisional}
        </p>
      </section>

      <section className="flex w-full max-w-sm flex-col gap-2 text-center">
        <p className="text-sm text-[#5a5a5a]">{ja.safety.privacyHeading}</p>
        <p className="text-xs text-[#6b6b6b]">{ja.safety.privacyNotice}</p>
      </section>

      <Button variant="text" href="/">
        {ja.safety.backLink}
      </Button>
    </main>
  );
}
