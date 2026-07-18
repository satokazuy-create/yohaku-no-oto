import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { MOOD_LABEL, MOOD_ORDER } from "@/lib/moods";

// S02気分選択の静的UI試作(設計書§14)。5択は同格の見た目にし、
// 「何も選びたくない」だけをグレーアウトしたりしない(設計書§7 委任優先)。
export default function ChoosePage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center gap-6 bg-[#FAF6EF] px-6 py-16 font-serif text-[#4a4a4a]">
      <h1 className="text-center text-lg">{ja.choose.heading}</h1>

      <div className="flex w-full max-w-xs flex-col gap-3">
        {MOOD_ORDER.map((mood) => (
          <Button key={mood} variant="list" href={`/play?mood=${mood}`}>
            {MOOD_LABEL[mood]}
          </Button>
        ))}
      </div>

      <Button variant="text" href="/">
        {ja.choose.backLink}
      </Button>
    </main>
  );
}
