import { Kuu } from "@/components/kuu";
import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";

// S05サウンドガーデンの静的UI試作(設計書§14・§17)。
// 数値・グラフ・日数は表示しない(設計書§17.3禁止事項)。garden_stateからの実描画は未実装。
export default function GardenPage() {
  return (
    <main className="safe-bottom flex min-h-screen flex-1 flex-col items-center justify-between gap-10 bg-gradient-to-b from-[#e9f0e6] to-[#FAF6EF] px-6 py-16 pb-20 text-center font-serif text-[#3d3833]">
      <div aria-hidden="true" />

      <section
        aria-hidden="true"
        className="flex h-40 w-full max-w-xs items-end justify-center rounded-t-full bg-[#d7e4d0]/60"
      >
        <div className="mb-0 h-12 w-full rounded-t-full bg-[#bcd2c8]/70" />
      </section>

      <section className="flex flex-col items-center gap-4">
        <Kuu className="kuu-float" size={72} />
        <p className="text-base leading-relaxed">{ja.garden.message}</p>
      </section>

      <Button variant="text" href="/">
        {ja.garden.backLink}
      </Button>
    </main>
  );
}
